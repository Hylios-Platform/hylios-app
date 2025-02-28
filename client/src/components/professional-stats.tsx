import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { 
  CheckCircle, 
  ThumbsUp, 
  Star, 
  Award,
  BarChart3,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

// Dados mockados para demonstração
const mockStats = {
  jobsCompleted: 15,
  acceptanceRate: 92,
  averageRating: 4.8,
  topSkills: [
    { name: "React", jobs: 8 },
    { name: "Node.js", jobs: 6 },
    { name: "TypeScript", jobs: 5 },
  ],
  monthlyActivity: [
    { month: "Jan", jobs: 3 },
    { month: "Fev", jobs: 2 },
    { month: "Mar", jobs: 4 },
    { month: "Abr", jobs: 3 },
    { month: "Mai", jobs: 3 },
  ]
};

export function ProfessionalStats() {
  const { user } = useAuth();

  if (!user || user.userType !== "professional") return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Trabalhos Concluídos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Trabalhos Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {mockStats.jobsCompleted}
            </div>
            <p className="text-xs text-green-600 mt-1">
              Último mês: +3 trabalhos
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Taxa de Aceitação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              Taxa de Aceitação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {mockStats.acceptanceRate}%
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Última semana: +2%
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Avaliação Média */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avaliação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">
              {mockStats.averageRating}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(mockStats.averageRating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-amber-200"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Especialidades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Top Especialidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockStats.topSkills.map((skill, index) => (
                <div key={skill.name} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-700">
                    {skill.name}
                  </span>
                  <span className="text-xs text-purple-600">
                    {skill.jobs} trabalhos
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráfico de Atividade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="md:col-span-2 lg:col-span-4"
      >
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-700 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Atividade Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2 pt-4">
              {mockStats.monthlyActivity.map((month, index) => (
                <div key={month.month} className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.jobs / 5) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="w-12 bg-blue-100 rounded-t-lg relative group"
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {month.jobs} trabalhos
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-600">{month.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tempo Médio de Resposta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="md:col-span-2 lg:col-span-4"
      >
        <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tempo Médio de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">
                2h 15min
              </div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <span>↓ 15%</span>
                <span className="text-gray-500">vs. último mês</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
