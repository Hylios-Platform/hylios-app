import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { URL } from "url";

interface NotificationData {
  type: string;
  message: string;
  data?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'temp-dev-secret';

export function setupWebSocket(httpServer: HttpServer) {
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: "/ws",
    clientTracking: true,
    perMessageDeflate: false,
    verifyClient: async (info, callback) => {
      try {
        // Extrair o token da URL
        const url = new URL(info.req.url!, `ws://${info.req.headers.host}`);
        const token = url.searchParams.get('token');

        console.log('[WebSocket] Tentativa de conexão com token:', token ? `${token.substring(0, 10)}...` : 'não fornecido');
        console.log('[WebSocket] Headers:', info.req.headers);

        if (!token) {
          console.log("[WebSocket] Token não fornecido na conexão");
          callback(false, 401, "Unauthorized - Token não fornecido");
          return;
        }

        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
          console.log('[WebSocket] Token decodificado:', decoded);

          const user = await storage.getUser(decoded.id);

          if (!user) {
            console.log("[WebSocket] Usuário não encontrado para o ID:", decoded.id);
            callback(false, 401, "Unauthorized - Usuário não encontrado");
            return;
          }

          console.log("[WebSocket] Usuário autenticado:", user.username);
          // Adiciona o usuário ao request para uso posterior
          (info.req as any).user = user;
          callback(true);
        } catch (jwtError) {
          console.error("[WebSocket] Erro na validação do token:", jwtError);
          callback(false, 401, "Unauthorized - Token inválido");
        }
      } catch (error) {
        console.error("[WebSocket] Erro na verificação do cliente:", error);
        callback(false, 500, "Internal Server Error");
      }
    }
  });

  console.log("[WebSocket] Servidor WebSocket iniciado na rota /ws");

  wss.on("connection", (ws, request) => {
    const user = (request as any).user;
    console.log("[WebSocket] Nova conexão estabelecida para usuário:", user.username);

    // Enviar mensagem de boas-vindas
    ws.send(JSON.stringify({
      type: "welcome",
      message: `Conectado às notificações do Hylios, ${user.username}!`
    }));

    // Setup heartbeat
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on("message", (message) => {
      try {
        console.log("[WebSocket] Mensagem recebida de", user.username + ":", message.toString());
        const data = JSON.parse(message.toString());
        handleMessage(ws, data, user);
      } catch (error) {
        console.error("[WebSocket] Erro ao processar mensagem:", error);
      }
    });

    ws.on("close", () => {
      console.log("[WebSocket] Conexão fechada para usuário:", user.username);
      ws.isAlive = false;
    });

    ws.on("error", (error) => {
      console.error("[WebSocket] Erro na conexão para usuário", user.username + ":", error);
      ws.isAlive = false;
    });
  });

  // Implementar heartbeat para manter conexões ativas
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log("[WebSocket] Terminando conexão inativa");
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(interval);
  });

  function handleMessage(ws: WebSocket, data: any, user: any) {
    try {
      console.log("[WebSocket] Processando mensagem de", user.username + ":", data);
      switch (data.type) {
        case "ping":
          ws.send(JSON.stringify({ type: "pong" }));
          break;
        default:
          console.log("[WebSocket] Tipo de mensagem desconhecido:", data.type);
      }
    } catch (error) {
      console.error("[WebSocket] Erro ao manipular mensagem:", error);
    }
  }

  function broadcast(data: NotificationData) {
    console.log("[WebSocket] Enviando broadcast:", data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  return { wss, broadcast };
}

// Estender o tipo WebSocket para incluir isAlive
declare module 'ws' {
  interface WebSocket {
    isAlive: boolean;
  }
}