import { User, Job, InsertUser, InsertJob, KycData } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobs: Map<number, Job>;
  private currentUserId: number;
  private currentJobId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.currentUserId = 1;
    this.currentJobId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      kycStatus: "pending",
      kycData: null,
      profileData: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createJob(job: InsertJob & { companyId: number }): Promise<Job> {
    const id = this.currentJobId++;
    const newJob: Job = {
      ...job,
      id,
      status: "open",
      assignedTo: null,
      createdAt: new Date()
    };
    this.jobs.set(id, newJob);
    return newJob;
  }

  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async updateJob(id: number, data: Partial<Job>): Promise<Job> {
    const job = await this.getJob(id);
    if (!job) throw new Error("Job not found");
    
    const updatedJob = { ...job, ...data };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async submitKyc(userId: number, kycData: KycData): Promise<User> {
    return this.updateUser(userId, {
      kycData,
      kycStatus: "pending"
    });
  }
}

export const storage = new MemStorage();
