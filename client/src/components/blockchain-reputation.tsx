import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Star, Award, TrendingUp } from "lucide-react";

export function BlockchainReputation() {
  const [score, setScore] = useState(85);
  
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-br from-white/80 via-blue-50/30 to-blue-100/20 border-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100/30">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-400" />
          Reputação na Blockchain
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-8 w-8 text-amber-400" />
            <div>
              <h3 className="font-semibold text-gray-800">Score de Confiança</h3>
              <p className="text-sm text-gray-600">Baseado em contratos completados</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-400">{score}</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progresso para próximo nível</span>
            <span>85%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300"
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 rounded-lg bg-white/50 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-amber-400" />
              <span className="font-medium text-gray-800">15</span>
            </div>
            <p className="text-sm text-gray-600">Avaliações Positivas</p>
          </div>
          <div className="p-3 rounded-lg bg-white/50 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="font-medium text-gray-800">100%</span>
            </div>
            <p className="text-sm text-gray-600">Taxa de Conclusão</p>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 hover:from-blue-400 hover:via-blue-500 hover:to-blue-400 text-white shadow-lg transition-all duration-300"
        >
          Ver Histórico na Blockchain
        </Button>
      </CardContent>
    </Card>
  );
}
