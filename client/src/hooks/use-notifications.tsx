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

  // Completely disabled for UI testing
  return {
    notifications,
    clearNotifications: () => {},
    socket: null
  };
}