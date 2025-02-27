import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'dev_secret_key',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Admin user
        if (username === 'admin' && password === 'admin123') {
          return done(null, {
            id: 1,
            username: 'admin',
            password: '',
            userType: 'professional',
            kycStatus: 'verified',
            kycData: null,
            companyName: null,
            profileData: null
          });
        }
        return done(null, false, { message: "Credenciais inválidas" });
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: number, done) => {
    if (id === 1) {
      done(null, {
        id: 1,
        username: 'admin',
        password: '',
        userType: 'professional',
        kycStatus: 'verified',
        kycData: null,
        companyName: null,
        profileData: null
      });
    } else {
      done(new Error('Usuário não encontrado'));
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Erro de autenticação:", err);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }

      if (!user) {
        console.log("Login falhou:", info?.message);
        return res.status(401).json({ message: info?.message || "Credenciais inválidas" });
      }

      req.login(user, (err) => {
        if (err) {
          console.error("Erro ao criar sessão:", err);
          return res.status(500).json({ message: "Erro ao criar sessão" });
        }
        console.log("Login bem-sucedido:", user.username);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.user) {
      return res.sendStatus(401);
    }
    res.json(req.user);
  });
}