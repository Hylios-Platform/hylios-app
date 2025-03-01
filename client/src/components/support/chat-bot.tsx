import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Loader2, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "user" | "assistant" | "error";
  content: string;
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isChatbotEnabled, setIsChatbotEnabled] = useState(true);
  const { toast } = useToast();

  // Verificar se o chatbot está disponível
  useEffect(() => {
    fetch('/api/chat/status')
      .then(response => {
        if (!response.ok) {
          setIsChatbotEnabled(false);
        }
      })
      .catch(() => {
        setIsChatbotEnabled(false);
      });
  }, []);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao enviar mensagem');
        }

        return response.json();
      } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
      }
    },
    onMutate: (message) => {
      const optimisticMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "error",
          content: "O serviço de chat está temporariamente indisponível. Por favor, tente novamente mais tarde.",
          timestamp: new Date(),
        },
      ]);

      toast({
        variant: "destructive",
        title: "Serviço Indisponível",
        description: "O chatbot está temporariamente indisponível. Tente novamente mais tarde.",
      });

      setIsChatbotEnabled(false);
    },
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessageMutation.mutate(input);
    setInput("");
  };

  if (!isChatbotEnabled) {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-full p-6 shadow-lg group"
        >
          <MessageCircle className="h-8 w-8 transition-transform group-hover:scale-110" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-6 w-96 z-50"
          >
            <Card className="border-blue-100 bg-white/90 backdrop-blur-sm shadow-xl dark:bg-slate-900/90">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  Assistente Virtual
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            message.type === "user"
                              ? "bg-blue-500 text-white"
                              : message.type === "error"
                              ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-gray-100 dark:bg-slate-800"
                          }`}
                        >
                          {message.type === "error" && (
                            <AlertCircle className="h-4 w-4 mb-1 inline-block mr-1" />
                          )}
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {sendMessageMutation.isPending && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl px-4 py-2">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="flex items-center gap-2 mt-4">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending || !input.trim() || !isChatbotEnabled}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}