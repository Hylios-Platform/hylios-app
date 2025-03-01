import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { storage } from "./storage";
import { setupChatRoutes } from "./routes/chat";

const app = express();

// Configuração básica
app.set('trust proxy', 1);

// Configuração CORS com configurações corretas para cookies
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://hylios.com' 
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Parsers e middlewares essenciais
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da sessão
const sessionSecret = process.env.SESSION_SECRET || 'hylios-secret-key';
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: storage.sessionStore,
  name: 'hylios.sid',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: 'lax',
    path: '/'
  }
}));

// Setup das rotas do chat
try {
  setupChatRoutes(app);
} catch (error) {
  console.error('Erro ao configurar rotas do chat:', error);
}

// Middleware de logging detalhado
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Pasta para arquivos enviados
app.use('/uploads', express.static('uploads'));

(async () => {
  try {
    const server = await registerRoutes(app);

    // Error handling middleware melhorado
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('[ERROR]', {
        message: err.message,
        stack: err.stack,
        status: err.status || err.statusCode
      });

      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ 
        error: message,
        status,
        timestamp: new Date().toISOString()
      });
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
    }, () => {
      log(`Servidor iniciado e rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('[FATAL ERROR] Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
})();