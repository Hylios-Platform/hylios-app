import { useAuth } from "@/hooks/use-auth";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// Função para calcular XP necessário para próximo nível
const getNextLevelXP = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

export function UserProgress() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  if (!user) return null;

  const nextLevelXP = getNextLevelXP(user.level);
  const progress = (user.experience / nextLevelXP) * 100;

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Nível {user.level}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
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
        </div>
      </CardContent>
    </Card>
  );
}
