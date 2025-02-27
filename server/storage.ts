import { users, type User, type InsertUser, jobs, type Job, type InsertJob, type KycData, achievements, userAchievements, type Achievement, type UserAchievement } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Existing methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  createJob(job: InsertJob & { companyId: number }): Promise<Job>;
  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  updateJob(id: number, data: Partial<Job>): Promise<Job>;
  submitKyc(userId: number, kycData: KycData): Promise<User>;
  sessionStore: session.Store;

  // Gamification methods
  addUserPoints(userId: number, points: number): Promise<User>;
  addUserExperience(userId: number, experience: number): Promise<User>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;
  unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement>;
  updateAchievementProgress(userId: number, achievementId: number, progress: number): Promise<UserAchievement>;

  // Novos métodos para carteira
  updateWalletAddress(userId: number, walletAddress: string): Promise<User>;
  updateWalletBalance(userId: number, amount: string): Promise<User>;

  // Novos métodos para créditos
  addCompanyCredits(companyId: number, amount: string): Promise<User>;
  removeCompanyCredits(companyId: number, amount: string): Promise<User>;

  // Novo método para pagamentos
  processJobPayment(jobId: number): Promise<Job>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Existing methods remain the same
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        kycStatus: "pending",
        kycData: null,
        profileData: null,
        level: 1,
        points: 0,
        experience: 0
      })
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  async createJob(job: InsertJob & { companyId: number }): Promise<Job> {
    const [newJob] = await db
      .insert(jobs)
      .values({
        ...job,
        status: "open",
        assignedTo: null,
        createdAt: new Date(),
      })
      .returning();
    return newJob;
  }

  async getJobs(): Promise<Job[]> {
    return db.select().from(jobs);
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async updateJob(id: number, data: Partial<Job>): Promise<Job> {
    const [job] = await db
      .update(jobs)
      .set(data)
      .where(eq(jobs.id, id))
      .returning();
    if (!job) throw new Error("Job not found");
    return job;
  }

  async submitKyc(userId: number, kycData: KycData): Promise<User> {
    return this.updateUser(userId, {
      kycData,
      kycStatus: "pending"
    });
  }

  // New gamification methods
  async addUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    return this.updateUser(userId, {
      points: user.points + points
    });
  }

  async addUserExperience(userId: number, experience: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const LEVEL_THRESHOLD = 1000; // Experience points needed per level
    const totalExperience = user.experience + experience;
    const newLevel = Math.floor(totalExperience / LEVEL_THRESHOLD) + 1;

    return this.updateUser(userId, {
      experience: totalExperience,
      level: newLevel
    });
  }

  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    return db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .leftJoin(achievements, eq(userAchievements.achievementId, achievements.id));
  }

  async unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    const [existing] = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        )
      );

    if (existing) {
      return existing;
    }

    const [achievement] = await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, achievementId));

    if (!achievement) throw new Error("Achievement not found");

    // Add achievement points to user
    await this.addUserPoints(userId, achievement.pointsReward);

    const [userAchievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
        progress: achievement.requiredValue,
        unlockedAt: new Date()
      })
      .returning();

    return userAchievement;
  }

  async updateAchievementProgress(userId: number, achievementId: number, progress: number): Promise<UserAchievement> {
    const [achievement] = await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, achievementId));

    if (!achievement) throw new Error("Achievement not found");

    const [existing] = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        )
      );

    // If achievement already unlocked, return existing
    if (existing && existing.progress >= achievement.requiredValue) {
      return existing;
    }

    // If progress meets requirement, unlock achievement
    if (progress >= achievement.requiredValue) {
      return this.unlockAchievement(userId, achievementId);
    }

    // Otherwise update progress
    if (existing) {
      const [updated] = await db
        .update(userAchievements)
        .set({ progress })
        .where(
          and(
            eq(userAchievements.userId, userId),
            eq(userAchievements.achievementId, achievementId)
          )
        )
        .returning();
      return updated;
    }

    // Create new progress entry
    const [created] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
        progress,
        unlockedAt: new Date()
      })
      .returning();

    return created;
  }

  async updateWalletAddress(userId: number, walletAddress: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ walletAddress })
      .where(eq(users.id, userId))
      .returning();
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }

  async updateWalletBalance(userId: number, amount: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("Usuário não encontrado");

    const newBalance = (parseFloat(user.walletBalance || "0") + parseFloat(amount)).toString();

    const [updatedUser] = await db
      .update(users)
      .set({ walletBalance: newBalance })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async addCompanyCredits(companyId: number, amount: string): Promise<User> {
    const company = await this.getUser(companyId);
    if (!company) throw new Error("Empresa não encontrada");
    if (company.userType !== "company") throw new Error("Usuário não é uma empresa");

    const newCredits = (parseFloat(company.companyCredits || "0") + parseFloat(amount)).toString();

    const [updatedCompany] = await db
      .update(users)
      .set({ companyCredits: newCredits })
      .where(eq(users.id, companyId))
      .returning();
    return updatedCompany;
  }

  async removeCompanyCredits(companyId: number, amount: string): Promise<User> {
    const company = await this.getUser(companyId);
    if (!company) throw new Error("Empresa não encontrada");
    if (company.userType !== "company") throw new Error("Usuário não é uma empresa");

    const currentCredits = parseFloat(company.companyCredits || "0");
    const amountToRemove = parseFloat(amount);

    if (currentCredits < amountToRemove) {
      throw new Error("Créditos insuficientes");
    }

    const newCredits = (currentCredits - amountToRemove).toString();

    const [updatedCompany] = await db
      .update(users)
      .set({ companyCredits: newCredits })
      .where(eq(users.id, companyId))
      .returning();
    return updatedCompany;
  }

  async processJobPayment(jobId: number): Promise<Job> {
    const job = await this.getJob(jobId);
    if (!job) throw new Error("Trabalho não encontrado");
    if (job.status !== "completed") throw new Error("Trabalho não está concluído");
    if (!job.assignedTo) throw new Error("Trabalho não está atribuído a nenhum profissional");

    // Remover créditos da empresa
    await this.removeCompanyCredits(job.companyId, job.amount);

    // Adicionar saldo na carteira do profissional
    await this.updateWalletBalance(job.assignedTo, job.amount);

    // Atualizar status do trabalho
    const [updatedJob] = await db
      .update(jobs)
      .set({ status: "paid" })
      .where(eq(jobs.id, jobId))
      .returning();

    return updatedJob;
  }
}

export const storage = new DatabaseStorage();