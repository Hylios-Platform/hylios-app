import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { storage } from "./storage";

const app = express();

// Configuração do multer para upload de arquivos
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limite de 5MB
  }
});

// Configuração básica
app.set('trust proxy', 1);

// Configuração dos middlewares na ordem correta
app.use(cookieParser());

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da sessão antes dos outros middlewares
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

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`[Request] ${req.method} ${req.path}`);
      console.log('Session ID:', req.sessionID);
      console.log('Is Authenticated:', req.isAuthenticated?.());
      console.log('Session:', req.session);
      console.log('Cookies:', req.cookies);
      console.log(`Response Status: ${res.statusCode} (${duration}ms)`);
    }
  });

  next();
});

// Pasta para arquivos enviados
app.use('/uploads', express.static('uploads'));

(async () => {
  try {
    const server = await registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
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