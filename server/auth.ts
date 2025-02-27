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
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'hylios-secret-key',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    name: 'hylios.sid',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log('[Auth] Tentativa de login:', username);
        const user = await storage.getUserByUsername(username);

        if (!user) {
          console.log('[Auth] Usuário não encontrado');
          return done(null, false, { message: "Usuário não encontrado" });
        }

        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          console.log('[Auth] Senha incorreta');
          return done(null, false, { message: "Senha incorreta" });
        }

        console.log('[Auth] Login bem-sucedido:', user.username);
        return done(null, user);
      } catch (error) {
        console.error('[Auth] Erro na autenticação:', error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log('[Auth] Serializando usuário:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log('[Auth] Desserializando usuário:', id);
      const user = await storage.getUser(id);
      if (!user) {
        console.log('[Auth] Usuário não encontrado na desserialização');
        return done(null, false);
      }
      console.log('[Auth] Usuário desserializado com sucesso:', user.username);
      done(null, user);
    } catch (error) {
      console.error('[Auth] Erro na desserialização:', error);
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
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
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error('[Auth] Erro no registro:', error);
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log('[Auth] Tentativa de login recebida:', req.body.username);
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error('[Auth] Erro no login:', err);
        return next(err);
      }
      if (!user) {
        console.log('[Auth] Login falhou:', info?.message);
        return res.status(401).json({ message: info?.message });
      }
      req.login(user, (err) => {
        if (err) {
          console.error('[Auth] Erro ao iniciar sessão:', err);
          return next(err);
        }
        console.log('[Auth] Login bem-sucedido:', user.username);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    const username = req.user?.username;
    console.log('[Auth] Tentativa de logout:', username);
    req.logout((err) => {
      if (err) {
        console.error('[Auth] Erro no logout:', err);
        return next(err);
      }
      console.log('[Auth] Logout bem-sucedido:', username);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log('[Auth] Verificando usuário atual:', req.user?.username || 'não autenticado');
    console.log('[Auth] Session ID:', req.sessionID);
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    res.json(req.user);
  });
}