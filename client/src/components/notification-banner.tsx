import { useNotifications } from "@/hooks/use-notifications";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NotificationBanner() {
  const { notifications, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen || notifications.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50 w-96 bg-white rounded-lg shadow-lg border border-blue-100"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Notificações</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNotifications}
                className="text-gray-500 hover:text-gray-700"
              >
                Limpar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={`p-3 rounded-md ${
                  notification.type === "newJob"
                    ? "bg-green-50 text-green-700"
                    : notification.type === "kycUpdate"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                <p className="font-medium">{notification.message}</p>
                {notification.data && (
                  <p className="text-sm mt-1 opacity-80">
                    {notification.type === "newJob" &&
                      `${notification.data.title} - ${notification.data.company}`}
                    {notification.type === "kycUpdate" &&
                      `Status: ${notification.data.status}`}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
