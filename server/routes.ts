import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware essencial primeiro
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Setup do Auth
  setupAuth(app);

  // Criar servidor HTTP
  const httpServer = createServer(app);

  return httpServer;
}