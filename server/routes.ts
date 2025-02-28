import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertJobSchema, kycSchema } from "@shared/schema";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { z } from "zod";
import { setupWebSocket } from "./websocket";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware essencial primeiro
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configuração do CORS
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Cookie parser needs to come before the session
  app.use(cookieParser());

  const sessionSecret = process.env.SESSION_SECRET || 'hylios-secret-key';
  if (!sessionSecret) {
    console.warn('Aviso: SESSION_SECRET não definido, usando valor padrão');
  }

  // Setup do Passport antes dos outros middlewares
  setupAuth(app);

  // Criar servidor HTTP
  const httpServer = createServer(app);

  // Configurar WebSocket
  const wsServer = setupWebSocket(httpServer);

  // ===== Endpoints de Vagas =====
  app.post("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized attempt to create job');
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    if (req.user.userType !== "company") {
      console.log('Forbidden attempt to create job by non-company user');
      return res.status(403).json({ error: "Apenas empresas podem publicar vagas" });
    }

    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob({
        ...jobData,
        companyId: req.user.id
      });

      // Notificar todos os usuários sobre nova vaga
      wsServer.broadcast({
        type: "newJob",
        message: "Nova vaga disponível!",
        data: {
          title: job.title,
          company: req.user.companyName
        }
      });

      console.log(`Job created successfully by company ${req.user.id}`);

      // Recompensas por publicar vaga
      await storage.addUserPoints(req.user.id, 50);
      await storage.addUserExperience(req.user.id, 100);
      await storage.updateAchievementProgress(req.user.id, 1, 1);

      res.status(201).json(job);
    } catch (error) {
      console.error('Error creating job:', error);
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
   * Body: Multipart form data com documentos e dados pessoais
   */
  app.post("/api/kyc", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });
    if (req.user.userType !== "professional") return res.status(403).json({ error: "Apenas profissionais precisam de KYC" });

    try {
      // Validar dados do formulário
      const kycData = kycSchema.parse(req.body);

      // Processar upload de arquivos
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const documentPath = files.document?.[0]?.path;
      const selfiePath = files.selfie?.[0]?.path;
      const proofOfAddressPath = files.proofOfAddress?.[0]?.path;

      // Validar presença dos arquivos obrigatórios
      if (!documentPath || !selfiePath || !proofOfAddressPath) {
        return res.status(400).json({ error: "Todos os documentos são obrigatórios" });
      }

      // Atualizar status KYC do usuário
      const user = await storage.submitKyc(req.user.id, {
        ...kycData,
        documentPath,
        selfiePath,
        proofOfAddressPath
      });

      // Notificar usuário sobre mudança no status KYC
      wsServer.broadcast({
        type: "kycUpdate",
        message: "Status KYC atualizado",
        data: {
          userId: req.user.id,
          status: user.kycStatus // Use the actual status from the user object
        }
      });

      // Recompensas por completar KYC
      await storage.addUserPoints(req.user.id, 100);
      await storage.addUserExperience(req.user.id, 200);
      await storage.updateAchievementProgress(req.user.id, 3, 1);

      res.json(user);
    } catch (error) {
      console.error("Erro ao processar KYC:", error);
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

    /**
   * Atualizar perfil do usuário
   * POST /api/profile
   * Requer: Usuário autenticado
   * Body: fullName, bio, location, skills
   */
  app.post("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });

    try {
      const user = await storage.updateUser(req.user.id, {
        profileData: req.body
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * Buscar histórico de trabalhos do usuário
   * GET /api/jobs/history
   * Requer: Usuário autenticado
   */
  app.get("/api/jobs/history", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });

    try {
      const jobs = await storage.getJobs();
      const userJobs = jobs.filter(job =>
        job.assignedTo === req.user.id ||
        (req.user.userType === "company" && job.companyId === req.user.id)
      );
      res.json(userJobs);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  /**
   * Atualizar configurações de notificação
   * POST /api/notifications/settings
   * Requer: Usuário autenticado
   * Body: Record<string, boolean> - configurações de notificação
   */
  app.post("/api/notifications/settings", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Usuário não autenticado" });

    try {
      const user = await storage.updateUser(req.user.id, {
        notificationSettings: req.body
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  return httpServer;
}