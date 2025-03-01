import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Phone, Globe, ArrowRight } from "lucide-react";

export default function Support() {
  const supportChannels = [
    {
      icon: MessageSquare,
      title: "Chat ao Vivo",
      description: "Converse em tempo real com nossa equipe de suporte",
      action: "Iniciar Chat",
      primary: true
    },
    {
      icon: Mail,
      title: "Email",
      description: "Envie sua dúvida para suporte@hylios.com",
      action: "Enviar Email"
    },
    {
      icon: Phone,
      title: "Telefone",
      description: "Atendimento de segunda a sexta, 9h às 18h",
      action: "Ligar Agora"
    },
    {
      icon: Globe,
      title: "Base de Conhecimento",
      description: "Encontre respostas para perguntas frequentes",
      action: "Acessar FAQ"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          Suporte
        </h1>
        <p className="text-lg text-gray-600">
          Como podemos ajudar você hoje?
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {supportChannels.map((channel, index) => {
          const Icon = channel.icon;
          return (
            <motion.div
              key={channel.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`hover:shadow-lg transition-shadow ${
                channel.primary ? 'border-blue-200 bg-blue-50/30' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      channel.primary ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        channel.primary ? 'text-blue-500' : 'text-gray-500'
                      }`} />
                    </div>
                    <CardTitle className="text-xl">{channel.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{channel.description}</p>
                  <Button
                    className={`w-full ${
                      channel.primary
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <span>{channel.action}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">Horário de Atendimento</h2>
        <p className="text-gray-600">
          Nossa equipe está disponível para ajudar você de segunda a sexta-feira, 
          das 9h às 18h (UTC-3). Para emergências fora do horário comercial, 
          utilize nosso chat automático.
        </p>
      </motion.div>
    </div>
  );
}
