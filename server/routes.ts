import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import express from "express";
import { setupWebSocket } from "./websocket";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware essencial primeiro
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Setup do Auth
  setupAuth(app);

  // Endpoint de debug para verificar a sessão
  app.get("/api/ping", (req, res) => {
    // Forçar resposta como JSON
    res.setHeader('Content-Type', 'application/json');

    console.log("[Debug] Session info:", {
      sessionID: req.sessionID,
      session: req.session,
      cookies: req.cookies,
      isAuthenticated: req.isAuthenticated?.(),
      user: req.user
    });

    res.json({
      status: "ok",
      sessionID: req.sessionID,
      isAuthenticated: req.isAuthenticated?.(),
      hasUser: !!req.user
    });
  });

  // Criar servidor HTTP
  const httpServer = createServer(app);

  // Setup WebSocket depois do servidor HTTP
  setupWebSocket(httpServer);

  return httpServer;
}