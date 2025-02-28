import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { storage } from "./storage";

const app = express();

// Configuração básica
app.set('trust proxy', 1);

// Parsers e middlewares essenciais primeiro
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração CORS com configurações corretas para cookies
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://hylios.com' 
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept']
}));

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

// Middleware de logging detalhado para debug de autenticação
app.use((req, res, next) => {
  const start = Date.now();

  // Log no início da requisição
  if (req.path.startsWith("/api")) {
    console.log(`[Request Start] ${req.method} ${req.path}`);
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('Cookies:', req.cookies);
    console.log('Headers:', req.headers);
  }

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`[Request End] ${req.method} ${req.path}`);
      console.log('Response Status:', res.statusCode);
      console.log('Duration:', duration, 'ms');
    }
  });

  next();
});

(async () => {
  try {
    // Registrar rotas da API primeiro
    const server = await registerRoutes(app);

    // Setup do Vite depois das rotas da API
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Sempre servir na porta 5000
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
    }, () => {
      log(`Servidor iniciado e rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
})();