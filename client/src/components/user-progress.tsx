import { useAuth } from "@/hooks/use-auth";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, ArrowUp, Medal, Target, Award, Gift } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Função para calcular XP necessário para próximo nível
const getNextLevelXP = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

// Lista de ranks baseados em nível com benefícios
const getRank = (level: number) => {
  if (level < 5) return { 
    title: "Iniciante", 
    color: "text-zinc-500",
    benefits: ["Acesso básico à plataforma", "Até 3 propostas por dia"]
  };
  if (level < 10) return { 
    title: "Intermediário", 
    color: "text-blue-500",
    benefits: ["Até 5 propostas por dia", "Destaque nas buscas", "Badge especial"]
  };
  if (level < 15) return { 
    title: "Avançado", 
    color: "text-purple-500",
    benefits: ["Propostas ilimitadas", "Prioridade no suporte", "Descontos exclusivos"]
  };
  if (level < 20) return { 
    title: "Expert", 
    color: "text-amber-500",
    benefits: ["Status verificado", "Acesso antecipado a vagas", "Comissão reduzida"]
  };
  return { 
    title: "Mestre", 
    color: "text-red-500",
    benefits: ["Todas as vantagens anteriores", "Mentoria exclusiva", "Programa VIP"]
  };
};

export function UserProgress() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  const nextLevelXP = getNextLevelXP(user.level);
  const progress = (user.experience / nextLevelXP) * 100;
  const rank = getRank(user.level);

  const achievements = [
    { icon: Medal, label: "KYC Verificado", achieved: user.kycStatus === "verified", points: 100 },
    { icon: Target, label: "5 Vagas Completadas", achieved: false, points: 200 },
    { icon: Award, label: "Top Profissional", achieved: false, points: 300 },
    { icon: Gift, label: "Primeiro Contrato", achieved: false, points: 150 }
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Nível {user.level}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${rank.color}`}>
                    {rank.title}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${rank.color.replace('text', 'bg')}`} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-64 p-3">
                <h4 className="font-medium mb-2">Benefícios do Rank</h4>
                <ul className="space-y-1">
                  {rank.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-current" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-indigo-700">{user.points} pontos</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-700">
              <ArrowUp className="h-4 w-4" />
              <span>{user.experience}/{nextLevelXP} XP</span>
            </div>
          </div>

          <div className="relative">
            <Progress value={progress} className="h-2" />
            {progress >= 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -right-1 -top-1 h-4 w-4 bg-amber-400 rounded-full border-2 border-white shadow-lg"
              />
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <AnimatePresence>
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-lg ${
                    achievement.achieved
                      ? "bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <achievement.icon
                    className={`h-6 w-6 mb-2 ${
                      achievement.achieved ? "text-amber-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-xs text-center font-medium ${
                      achievement.achieved ? "text-amber-700" : "text-gray-500"
                    }`}
                  >
                    {achievement.label}
                  </span>
                  <span className="text-[10px] mt-1 text-gray-400">
                    +{achievement.points} XP
                  </span>
                  {achievement.achieved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-[10px]">✓</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}