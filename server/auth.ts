import { Express, Request, Response } from "express";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { User as SelectUser } from "@shared/schema";

const scryptAsync = promisify(scrypt);
const JWT_SECRET = process.env.JWT_SECRET || 'temp-dev-secret';

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

function generateToken(user: SelectUser) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
}

export async function authenticateToken(req: Request, res: Response, next: Function) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('[Auth] Token recebido:', token ? 'presente' : 'ausente');

    if (!token) {
      return res.sendStatus(401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    console.log('[Auth] Token decodificado:', decoded);

    const user = await storage.getUser(decoded.id);
    console.log('[Auth] Usuário encontrado:', user ? 'sim' : 'não');

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth] Erro na autenticação:', error);
    return res.sendStatus(401);
  }
}

export function setupAuth(app: Express) {
  // Registro
  app.post("/api/register", async (req, res) => {
    try {
      console.log('[Auth] Tentativa de registro:', req.body.username);
      const existingUser = await storage.getUserByUsername(req.body.username);

      if (existingUser) {
        console.log('[Auth] Usuário já existe');
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      console.log('[Auth] Usuário registrado com sucesso:', user.username);
      const token = generateToken(user);
      res.status(201).json({ user, token });
    } catch (error) {
      console.error('[Auth] Erro no registro:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login
  app.post("/api/login", async (req, res) => {
    try {
      console.log('[Auth] Tentativa de login:', req.body.username);
      const user = await storage.getUserByUsername(req.body.username);

      if (!user) {
        console.log('[Auth] Usuário não encontrado');
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await comparePasswords(req.body.password, user.password);
      if (!isValidPassword) {
        console.log('[Auth] Senha incorreta');
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log('[Auth] Login bem-sucedido:', user.username);
      const token = generateToken(user);
      res.json({ user, token });
    } catch (error) {
      console.error('[Auth] Erro no login:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Obter usuário atual
  app.get("/api/user", authenticateToken, (req, res) => {
    console.log('[Auth] Retornando dados do usuário:', req.user?.username);
    res.json(req.user);
  });
}

// Adicionar tipos para o Express
declare global {
  namespace Express {
    interface Request {
      user?: SelectUser;
    }
  }
}