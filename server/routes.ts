import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertJobSchema, kycSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Jobs
  app.post("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.userType !== "company") return res.sendStatus(403);

    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob({
        ...jobData,
        companyId: req.user.id
      });
      res.status(201).json(job);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  app.get("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const jobs = await storage.getJobs();
    res.json(jobs);
  });

  app.post("/api/jobs/:id/apply", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.userType !== "professional") return res.sendStatus(403);
    if (req.user.kycStatus !== "verified") {
      return res.status(400).json({ error: "KYC verification required" });
    }

    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.status !== "open") {
      return res.status(400).json({ error: "Job is not available" });
    }

    const updatedJob = await storage.updateJob(job.id, {
      status: "assigned",
      assignedTo: req.user.id
    });
    res.json(updatedJob);
  });

  // KYC
  app.post("/api/kyc", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.userType !== "professional") return res.sendStatus(403);

    try {
      const kycData = kycSchema.parse(req.body);
      const user = await storage.submitKyc(req.user.id, kycData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
