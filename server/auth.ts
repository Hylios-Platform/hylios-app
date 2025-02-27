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
        // Durante o desenvolvimento, aceita qualquer usuário
        const devUser = {
          id: 1,
          username: username,
          password: '',
          userType: 'professional',
          kycStatus: 'verified',
          kycData: null,
          companyName: null,
          profileData: null
        };
        return done(null, devUser);

      } catch (error) {
        console.error("Erro na autenticação:", error);
        return done(error, false, {
          message: "Ocorreu um erro durante a autenticação. Tente novamente mais tarde."
        });
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: number, done) => {
    done(null, {
      id: 1,
      username: 'dev_user',
      password: '',
      userType: 'professional',
      kycStatus: 'verified',
      kycData: null,
      companyName: null,
      profileData: null
    });
  });

  app.post("/api/login", (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ 
        message: "Nome de usuário e senha são obrigatórios"
      });
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
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
          return res.status(500).json({ 
            message: "Erro ao iniciar sessão. Tente novamente."
          });
        }
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
    if (!req.user) {
      return res.status(401).json({
        message: "Usuário não autenticado. Faça login novamente."
      });
    }
    res.json(req.user);
  });
}