import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertJobSchema, kycSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // ===== Endpoints de Vagas =====

  /**
   * Criar uma nova vaga
   * POST /api/jobs
   * Requer: Usuário autenticado e do tipo empresa
   * Body: title, description, amount, currency, location
   */
  app.post("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });
    if (req.user.userType !== "company") return res.status(403).json({ error: "Apenas empresas podem publicar vagas" });

    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob({
        ...jobData,
        companyId: req.user.id
      });

      // Recompensas por publicar vaga
      await storage.addUserPoints(req.user.id, 50);
      await storage.addUserExperience(req.user.id, 100);
      await storage.updateAchievementProgress(req.user.id, 1, 1);

      res.status(201).json(job);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * Listar todas as vagas
   * GET /api/jobs
   * Requer: Usuário autenticado
   */
  app.get("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });
    const jobs = await storage.getJobs();
    res.json(jobs);
  });

  /**
   * Candidatar-se a uma vaga
   * POST /api/jobs/:id/apply
   * Requer: Usuário autenticado, do tipo profissional e com KYC verificado
   */
  app.post("/api/jobs/:id/apply", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });
    if (req.user.userType !== "professional") return res.status(403).json({ error: "Apenas profissionais podem se candidatar" });
    if (req.user.kycStatus !== "verified") {
      return res.status(400).json({ error: "Verificação KYC necessária para se candidatar" });
    }

    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ error: "Vaga não encontrada" });
    if (job.status !== "open") {
      return res.status(400).json({ error: "Vaga não está mais disponível" });
    }

    try {
      const updatedJob = await storage.updateJob(job.id, {
        status: "assigned",
        assignedTo: req.user.id
      });

      // Recompensas por se candidatar
      await storage.addUserPoints(req.user.id, 20);
      await storage.addUserExperience(req.user.id, 50);
      await storage.updateAchievementProgress(req.user.id, 2, 1);

      res.json(updatedJob);
    } catch (error) {
      res.status(500).json({ error: "Erro ao processar candidatura" });
    }
  });

  // ===== Endpoints de KYC =====

  /**
   * Enviar documentos KYC
   * POST /api/kyc
   * Requer: Usuário autenticado e do tipo profissional
   * Body: fullName, dateOfBirth, documentType, documentNumber, address
   */
  app.post("/api/kyc", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });
    if (req.user.userType !== "professional") return res.status(403).json({ error: "Apenas profissionais precisam de KYC" });

    try {
      const kycData = kycSchema.parse(req.body);
      const user = await storage.submitKyc(req.user.id, kycData);

      // Recompensas por completar KYC
      await storage.addUserPoints(req.user.id, 100);
      await storage.addUserExperience(req.user.id, 200);
      await storage.updateAchievementProgress(req.user.id, 3, 1);

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  // ===== Endpoints de Gamificação =====

  /**
   * Listar conquistas do usuário
   * GET /api/user/achievements
   * Requer: Usuário autenticado
   */
  app.get("/api/user/achievements", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });

    try {
      const achievements = await storage.getUserAchievements(req.user.id);
      res.json(achievements);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * Atualizar progresso de conquista
   * POST /api/user/achievements/:id/progress
   * Requer: Usuário autenticado
   * Body: progress (number)
   */
  app.post("/api/user/achievements/:id/progress", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });

    try {
      const achievement = await storage.updateAchievementProgress(
        req.user.id,
        Number(req.params.id),
        req.body.progress
      );
      res.json(achievement);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  // ===== Endpoints de Carteira =====

  /**
   * Atualizar endereço da carteira
   * POST /api/wallet
   * Requer: Usuário autenticado
   * Body: walletAddress (string)
   */
  app.post("/api/wallet", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });

    try {
      const { walletAddress } = req.body;
      if (!walletAddress) {
        return res.status(400).json({ error: "Endereço da carteira é obrigatório" });
      }

      const user = await storage.updateWalletAddress(req.user.id, walletAddress);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  // ===== Endpoints de Créditos =====

  /**
   * Adicionar créditos à empresa
   * POST /api/credits/add
   * Requer: Usuário autenticado e do tipo empresa
   * Body: amount (string)
   */
  app.post("/api/credits/add", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });
    if (req.user.userType !== "company") return res.status(403).json({ error: "Apenas empresas podem adicionar créditos" });

    try {
      const { amount } = req.body;
      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: "Valor inválido" });
      }

      const user = await storage.addCompanyCredits(req.user.id, amount);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * Processar pagamento de trabalho
   * POST /api/jobs/:id/pay
   * Requer: Usuário autenticado, do tipo empresa e dono do trabalho
   */
  app.post("/api/jobs/:id/pay", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });
    if (req.user.userType !== "company") return res.status(403).json({ error: "Apenas empresas podem fazer pagamentos" });

    try {
      const job = await storage.getJob(Number(req.params.id));
      if (!job) return res.status(404).json({ error: "Trabalho não encontrado" });
      if (job.companyId !== req.user.id) {
        return res.status(403).json({ error: "Você não tem permissão para pagar este trabalho" });
      }

      const updatedJob = await storage.processJobPayment(job.id);
      res.json(updatedJob);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}