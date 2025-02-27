import { Job } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import { 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

interface MatchMenuProps {
  job: Job;
  userSkills: string[];
  userLocation: string;
  matchScore: number;
}

export function MatchMenu({ job, userSkills, userLocation, matchScore }: MatchMenuProps) {
  // Calcular matches de habilidades
  const matchedSkills = job.requiredSkills?.filter(skill => 
    userSkills.includes(skill)
  ) || [];
  
  const missingSkills = job.requiredSkills?.filter(skill => 
    !userSkills.includes(skill)
  ) || [];

  // Calcular match de localização
  const locationMatch = userLocation === `${job.city}, ${job.country}`;

  // Determinar o status do match
  const getMatchStatus = () => {
    if (matchScore >= 80) return { icon: CheckCircle2, color: "text-green-500", text: "Match Excelente!" };
    if (matchScore >= 60) return { icon: Star, color: "text-yellow-500", text: "Bom Match" };
    return { icon: AlertCircle, color: "text-blue-500", text: "Match Parcial" };
  };

  const status = getMatchStatus();
  const StatusIcon = status.icon;

  return (
    <Card className="border-blue-100 bg-blue-50/10 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-blue-500 flex items-center gap-2">
          <StatusIcon className={`h-5 w-5 ${status.color}`} />
          Análise de Compatibilidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score geral */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Score de Match</span>
            <span className="font-medium text-blue-600">{matchScore}%</span>
          </div>
          <Progress value={matchScore} className="h-2" />
        </div>

        {/* Detalhes do match */}
        <div className="grid gap-3">
          {/* Habilidades */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <GraduationCap className="h-4 w-4 text-blue-400" />
              <span>Habilidades Compatíveis</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded-full"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Habilidades faltantes */}
          {missingSkills.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <span>Habilidades a Desenvolver</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-2 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Localização */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-blue-400" />
            <span className="text-gray-600">Localização:</span>
            <span className={locationMatch ? "text-green-600" : "text-yellow-600"}>
              {locationMatch ? "Compatível" : "Diferente"}
            </span>
          </div>

          {/* Tipo de Trabalho */}
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-blue-400" />
            <span className="text-gray-600">Tipo de Trabalho:</span>
            <span className="text-blue-600 capitalize">{job.workType}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
