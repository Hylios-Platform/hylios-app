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
        // Modo de desenvolvimento: aceita qualquer credencial
        const devUser = {
          id: 1,
          username: username || 'dev_user',
          password: '',
          userType: 'professional',
          kycStatus: 'verified',
          kycData: null,
          companyName: null,
          profileData: null,
          email: 'dev@example.com',
          age: 25,
          gender: 'male'
        };
        return done(null, devUser);
      } catch (error) {
        console.error("Erro na autenticação:", error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: number, done) => {
    // Retorna o mesmo usuário de desenvolvimento
    done(null, {
      id: 1,
      username: 'dev_user',
      password: '',
      userType: 'professional',
      kycStatus: 'verified',
      kycData: null,
      companyName: null,
      profileData: null,
      email: 'dev@example.com',
      age: 25,
      gender: 'male'
    });
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login attempt:", req.body); // Log para debug
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ 
          message: "Erro interno do servidor. Tente novamente mais tarde."
        });
      }

      if (!user) {
        return res.status(401).json({ 
          message: info?.message || "Credenciais inválidas. Verifique seu nome de usuário e senha."
        });
      }

      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          return res.status(500).json({ 
            message: "Erro ao iniciar sessão. Tente novamente."
          });
        }
        console.log("Login successful:", user);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ 
          message: "Erro ao fazer logout. Tente novamente."
        });
      }
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("Current user:", req.user); // Log para debug
    if (!req.user) {
      return res.status(401).json({
        message: "Usuário não autenticado. Faça login novamente."
      });
    }
    res.json(req.user);
  });
}