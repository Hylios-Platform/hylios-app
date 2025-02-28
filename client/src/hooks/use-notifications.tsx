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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.log('[WebSocket] Token não encontrado, usuário não autenticado');
          toast({
            title: "Erro de Conexão",
            description: "Faça login para receber notificações em tempo real.",
            variant: "destructive",
          });
          return;
        }

        // Adicionar logs para debug do token
        console.log('[WebSocket] Token recuperado:', token.substring(0, 10) + '...');

        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws?token=${token}`;
        console.log('[WebSocket] Tentando conectar em:', wsUrl);

        if (socketRef.current?.readyState === WebSocket.OPEN) {
          console.log('[WebSocket] Fechando conexão existente');
          socketRef.current.close();
        }

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          console.log('[WebSocket] Conexão estabelecida com sucesso');
          setIsConnected(true);
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
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

            if (notification.type !== 'welcome' && notification.type !== 'pong') {
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

        ws.onclose = (event) => {
          console.log('[WebSocket] Conexão fechada:', event.code, event.reason);
          setIsConnected(false);

          // Tentar reconectar apenas se não foi um fechamento proposital
          if (event.code !== 1000) {
            console.log('[WebSocket] Agendando reconexão em 5 segundos...');
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
          }
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
            console.log('[WebSocket] Enviando ping');
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 25000);

        return () => {
          clearInterval(pingInterval);
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          if (ws.readyState === WebSocket.OPEN) {
            ws.close(1000, "Fechamento normal");
          }
        };
      } catch (error) {
        console.error('[WebSocket] Erro ao criar conexão:', error);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível estabelecer conexão com o servidor.",
          variant: "destructive",
        });
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close(1000, "Componente desmontado");
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