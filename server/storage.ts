import { users, type User, type InsertUser, jobs, type Job, type InsertJob, type KycData } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
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
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

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
}

export const storage = new DatabaseStorage();