import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Rocket, Bitcoin, Sparkles } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Shield,
      title: "Segurança Blockchain",
      description: "Transações seguras e transparentes com tecnologia blockchain"
    },
    {
      icon: Rocket,
      title: "Matchmaking IA",
      description: "Sistema avançado de correspondência com Machine Learning e NLP"
    },
    {
      icon: Bitcoin,
      title: "Pagamentos Bitcoin",
      description: "Pagamentos exclusivos e seguros em Bitcoin (BTC)"
    },
    {
      icon: Sparkles,
      title: "UX Inovadora",
      description: "Interface moderna e intuitiva para melhor experiência"
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
          Sobre o Hylios
        </h1>
        <p className="text-lg text-gray-600">
          Plataforma inovadora de contratação de serviços instantâneos que conecta profissionais e 
          empresas através de uma experiência digital moderna e intuitiva.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">Nossa Missão</h2>
        <p className="text-gray-600">
          Conectar talentos excepcionais com oportunidades transformadoras, 
          revolucionando a forma como profissionais e empresas interagem no 
          mercado digital, com transparência, segurança e inovação.
        </p>
      </motion.div>
    </div>
  );
}
