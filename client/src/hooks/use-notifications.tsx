import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  type: string;
  message: string;
  data?: any;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        console.log('[WebSocket] Conectando ao servidor:', wsUrl);

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          console.log('[WebSocket] Conexão estabelecida');
          setIsConnected(true);
          toast({
            title: "Conectado",
            description: "Você está conectado às notificações em tempo real.",
            className: "bg-green-50 border-green-200",
          });
        };

        ws.onmessage = (event) => {
          try {
            const notification = JSON.parse(event.data);
            console.log('[WebSocket] Notificação recebida:', notification);

            setNotifications(prev => [notification, ...prev]);

            // Mostrar toast para novas notificações
            if (notification.type !== 'welcome') {
              toast({
                title: notification.type,
                description: notification.message,
                className: "bg-blue-50 border-blue-200",
              });
            }
          } catch (error) {
            console.error('[WebSocket] Erro ao processar mensagem:', error);
          }
        };

        ws.onclose = () => {
          console.log('[WebSocket] Conexão fechada');
          setIsConnected(false);
          // Tentar reconectar após 5 segundos
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('[WebSocket] Erro na conexão:', error);
          toast({
            title: "Erro de conexão",
            description: "Houve um problema com as notificações em tempo real.",
            variant: "destructive",
          });
        };

        // Setup heartbeat
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 25000);

        return () => {
          clearInterval(pingInterval);
          if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        };
      } catch (error) {
        console.error('[WebSocket] Erro ao criar conexão:', error);
        setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [toast]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    clearNotifications,
    isConnected,
    socket: socketRef.current
  };
}