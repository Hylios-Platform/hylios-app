import { User as SelectUser, InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<SelectUser | undefined>;
  getUserByUsername(username: string): Promise<SelectUser | undefined>;
  createUser(user: InsertUser): Promise<SelectUser>;
  sessionStore: session.Store;
}

// Armazenamento temporário em memória
export class MemStorage implements IStorage {
  private users: SelectUser[] = [];
  private currentId = 1;
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Limpar sessões expiradas a cada 24 horas
    });
  }

  async getUser(id: number): Promise<SelectUser | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<SelectUser | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<SelectUser> {
    const user: SelectUser = {
      id: this.currentId++,
      ...insertUser,
      createdAt: new Date(),
      updatedAt: new Date(),
      kycStatus: "pending",
      kycData: null,
      profileData: null,
      level: 1,
      points: 0,
      experience: 0
    };
    this.users.push(user);
    return user;
  }
}

export const storage = new MemStorage();