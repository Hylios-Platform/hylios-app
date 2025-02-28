import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  type: string;
  message: string;
  data?: any;
}

export function useNotifications() {
  const [notifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // WebSocket temporariamente desabilitado até resolvermos o erro 400
  // Isso permitirá que a UI e animações funcionem sem interferência
  return {
    notifications,
    clearNotifications: () => {},
    socket: null
  };
}