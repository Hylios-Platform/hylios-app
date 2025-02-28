import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  type: string;
  message: string;
  data?: any;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  // Temporarily desabled for UI testing
  const connect = () => {
    console.log("WebSocket temporarily disabled for testing");
  };

  return {
    notifications,
    clearNotifications: () => setNotifications([]),
    socket: null
  };
}