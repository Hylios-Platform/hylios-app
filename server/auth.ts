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
      secure: false, // set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      sameSite: 'lax'
    },
    name: 'hylios.sid' // nome personalizado para o cookie
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`Tentativa de login para usuário: ${username}`);
        const user = await storage.getUserByUsername(username);

        if (!user) {
          console.log('Usuário não encontrado');
          return done(null, false, { message: "Usuário não encontrado" });
        }

        // Em desenvolvimento, aceita qualquer senha
        console.log('Login bem sucedido:', user);
        return done(null, user);
      } catch (error) {
        console.error("Erro na autenticação:", error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log('Serializando usuário:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log('Desserializando usuário:', id);
      const user = await storage.getUser(id);
      if (!user) {
        console.log('Usuário não encontrado na desserialização');
        return done(null, false);
      }
      console.log('Usuário desserializado com sucesso');
      done(null, user);
    } catch (error) {
      console.error('Erro na desserialização:', error);
      done(error);
    }
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