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
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    },
    name: 'hylios.sid'
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`[Auth] Tentativa de login para usuário: ${username}`);
        const user = await storage.getUserByUsername(username);

        if (!user) {
          // Em desenvolvimento, criar usuário sob demanda
          if (process.env.NODE_ENV === 'development' && username === 'teste' && password === 'senha123') {
            console.log('[Auth] Criando usuário de teste sob demanda');
            const newUser = await storage.createUser({
              username: 'teste',
              password: 'senha123',
              userType: 'professional',
            });
            console.log('[Auth] Usuário de teste criado:', newUser);
            return done(null, newUser);
          }

          console.log('[Auth] Usuário não encontrado');
          return done(null, false, { message: "Usuário não encontrado" });
        }

        // Em desenvolvimento, aceitar senha123 para o usuário teste
        const isValidPassword = process.env.NODE_ENV === 'development' && username === 'teste' && password === 'senha123';

        if (!isValidPassword) {
          console.log('[Auth] Senha incorreta');
          return done(null, false, { message: "Senha incorreta" });
        }

        console.log('[Auth] Login bem sucedido:', user);
        return done(null, user);
      } catch (error) {
        console.error("[Auth] Erro na autenticação:", error);
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

  app.post("/api/login", (req, res, next) => {
    console.log("[Auth] Tentativa de login recebida:", req.body);
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("[Auth] Erro no login:", err);
        return res.status(500).json({ 
          message: "Erro interno do servidor. Tente novamente mais tarde."
        });
      }

      if (!user) {
        console.log("[Auth] Login falhou:", info?.message);
        return res.status(401).json({ 
          message: info?.message || "Credenciais inválidas. Verifique seu nome de usuário e senha."
        });
      }

      req.login(user, (err) => {
        if (err) {
          console.error("[Auth] Erro ao iniciar sessão:", err);
          return res.status(500).json({ 
            message: "Erro ao iniciar sessão. Tente novamente."
          });
        }
        console.log("[Auth] Login realizado com sucesso:", user.username);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    const username = req.user?.username;
    req.logout((err) => {
      if (err) {
        console.error("[Auth] Erro no logout:", err);
        return res.status(500).json({ 
          message: "Erro ao fazer logout. Tente novamente."
        });
      }
      console.log("[Auth] Logout realizado com sucesso:", username);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("[Auth] Verificando usuário atual:", req.user?.username || 'não autenticado');
    if (!req.user) {
      return res.status(401).json({
        message: "Usuário não autenticado. Faça login novamente."
      });
    }
    res.json(req.user);
  });
}