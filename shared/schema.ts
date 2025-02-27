import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(), // "company" or "professional"
  kycStatus: text("kyc_status").notNull().default("pending"), // "pending", "verified", "rejected"
  kycData: jsonb("kyc_data"),
  companyName: text("company_name"),
  profileData: jsonb("profile_data"),
  // Gamification fields
  level: integer("level").notNull().default(1),
  points: integer("points").notNull().default(0),
  experience: integer("experience").notNull().default(0)
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "profile", "jobs", "kyc", "engagement"
  pointsReward: integer("points_reward").notNull(),
  requiredValue: integer("required_value").notNull(), // Value needed to unlock
  icon: text("icon").notNull() // Icon identifier for the achievement
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  progress: integer("progress").notNull().default(0)
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  companyId: integer("company_id").notNull(),
  bitcoinAmount: text("bitcoin_amount").notNull(),
  status: text("status").notNull().default("open"), // "open", "assigned", "completed"
  assignedTo: integer("assigned_to"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Schema for user achievements
export const achievementSchema = createInsertSchema(achievements);
export const userAchievementSchema = createInsertSchema(userAchievements);

// Extend user insert schema with gamification fields
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  userType: true,
  companyName: true
}).extend({
  userType: z.enum(["company", "professional"]),
  companyName: z.string().optional()
});

export const insertJobSchema = createInsertSchema(jobs).pick({
  title: true,
  description: true,
  bitcoinAmount: true
});

export const kycSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string(),
  documentType: z.enum(["passport", "id_card", "drivers_license"]),
  documentNumber: z.string(),
  address: z.string()
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type KycData = z.infer<typeof kycSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;