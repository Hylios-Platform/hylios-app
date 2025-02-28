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

  wss.on("connection", (ws) => {
    console.log("Nova conexão WebSocket estabelecida");
    
    // Enviar mensagem de boas-vindas
    ws.send(JSON.stringify({
      type: "welcome",
      message: "Conectado às notificações do Hylios!"
    }));

    ws.on("message", (message) => {
      try {
        console.log("Mensagem recebida:", message.toString());
        const data = JSON.parse(message.toString());
        handleMessage(ws, data);
      } catch (error) {
        console.error("Erro ao processar mensagem:", error);
      }
    });

    ws.on("close", () => {
      console.log("Conexão WebSocket fechada");
    });
  });

  function handleMessage(ws: WebSocket, data: any) {
    switch (data.type) {
      case "ping":
        ws.send(JSON.stringify({ type: "pong" }));
        break;
      default:
        console.log("Tipo de mensagem desconhecido:", data.type);
    }
  }

  function broadcast(data: NotificationData) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  return { wss, broadcast };
}
