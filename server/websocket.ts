import { Server as HttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

interface NotificationData {
  type: string;
  message: string;
  data?: any;
}

export function setupWebSocket(httpServer: HttpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  console.log("Servidor WebSocket iniciado na rota /ws");

  wss.on("connection", (ws, request) => {
    console.log("[WebSocket] Nova conexão estabelecida");
    console.log("[WebSocket] Headers:", request.headers);
    console.log("[WebSocket] URL:", request.url);

    // Enviar mensagem de boas-vindas
    ws.send(JSON.stringify({
      type: "welcome",
      message: "Conectado às notificações do Hylios!"
    }));

    ws.on("message", (message) => {
      try {
        console.log("[WebSocket] Mensagem recebida:", message.toString());
        const data = JSON.parse(message.toString());
        handleMessage(ws, data);
      } catch (error) {
        console.error("[WebSocket] Erro ao processar mensagem:", error);
      }
    });

    ws.on("close", () => {
      console.log("[WebSocket] Conexão fechada");
    });

    ws.on("error", (error) => {
      console.error("[WebSocket] Erro na conexão:", error);
    });
  });

  wss.on("error", (error) => {
    console.error("[WebSocket Server] Erro no servidor:", error);
  });

  function handleMessage(ws: WebSocket, data: any) {
    try {
      console.log("[WebSocket] Processando mensagem:", data);
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