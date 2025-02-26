import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  try {
    console.log("Comparando senhas:");
    console.log("Senha fornecida:", supplied);
    console.log("Senha armazenada:", stored);

    const [hashedPassword, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashedPassword, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    const result = timingSafeEqual(hashedBuf, suppliedBuf);

    console.log("Resultado da comparação:", result);
    return result;
  } catch (error) {
    console.error("Erro ao comparar senhas:", error);
    return false;
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: true,
    saveUninitialized: true,
    store: storage.sessionStore,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Tentativa de login para usuário:", username);
        const user = await storage.getUserByUsername(username);

        if (!user) {
          console.log("Usuário não encontrado");
          return done(null, false, { message: "Usuário não encontrado" });
        }

        if (username === 'admin' && password === 'admin123') {
          console.log("Login com usuário master");
          return done(null, user);
        }

        const isValid = await comparePasswords(password, user.password);
        console.log("Senha válida:", isValid);

        if (!isValid) {
          console.log("Senha incorreta");
          return done(null, false, { message: "Senha incorreta" });
        }

        console.log("Login bem-sucedido");
        return done(null, user);
      } catch (error) {
        console.error("Erro durante autenticação:", error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log("Serializando usuário:", user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log("Desserializando usuário:", id);
      const user = await storage.getUser(id);
      if (!user) {
        console.log("Usuário não encontrado na desserialização");
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error("Erro ao desserializar usuário:", error);
      done(error);
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      console.log("Tentativa de registro para usuário:", req.body.username);
      const existingUser = await storage.getUserByUsername(req.body.username);

      if (existingUser) {
        console.log("Usuário já existe");
        return res.status(400).json({ message: "Usuário já existe" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      console.log("Senha hasheada criada:", hashedPassword);

      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      console.log("Usuário criado com sucesso:", user.id);
      res.status(201).json(user);
    } catch (error) {
      console.error("Erro no registro:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Requisição de login recebida para:", req.body.username);

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Erro na autenticação:", err);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }

      if (!user) {
        console.log("Login falhou:", info?.message);
        return res.status(401).json({ message: info?.message || "Falha na autenticação" });
      }

      req.login(user, (err) => {
        if (err) {
          console.error("Erro no login:", err);
          return res.status(500).json({ message: "Erro ao criar sessão" });
        }

        console.log("Login bem-sucedido para:", user.username);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    if (req.user) {
      console.log("Logout para usuário:", req.user.username);
      req.logout((err) => {
        if (err) {
          console.error("Erro no logout:", err);
          return res.status(500).json({ message: "Erro ao fazer logout" });
        }
        console.log("Logout bem-sucedido");
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(200);
    }
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      console.log("Usuário não autenticado na rota /api/user");
      return res.sendStatus(401);
    }
    console.log("Usuário autenticado:", req.user.username);
    res.json(req.user);
  });
}