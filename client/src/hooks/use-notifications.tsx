import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  type: string;
  message: string;
  data?: any;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { toast } = useToast();

  const connect = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("Conexão WebSocket estabelecida");
      // Enviar ping periódico para manter conexão ativa
      setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        setNotifications(prev => [...prev, notification]);

        // Mostrar toast para notificações importantes
        if (notification.type !== "pong") {
          toast({
            title: notification.type === "newJob" ? "Nova Vaga" : "Notificação",
            description: notification.message,
            variant: notification.type === "error" ? "destructive" : "default",
          });
        }
      } catch (error) {
        console.error("Erro ao processar mensagem:", error);
      }
    };

    ws.onclose = () => {
      console.log("Conexão WebSocket fechada. Tentando reconectar em 5s...");
      setTimeout(connect, 5000);
    };

    ws.onerror = (error) => {
      console.error("Erro na conexão WebSocket:", error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [toast]);

  useEffect(() => {
    connect();
  }, [connect]);

  return {
    notifications,
    clearNotifications: () => setNotifications([]),
    socket
  };
}
