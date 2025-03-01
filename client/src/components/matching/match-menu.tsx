import { Job } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Clock,
  UserCheck,
  Building2,
  Sparkles,
  InfoIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { simulateHiring } from "@/lib/matching-service";
import { LucideIcon } from "lucide-react/types";


interface MatchMenuProps {
  job: Job;
  userSkills: string[];
  userLocation: string;
  matchScore: number;
}

interface MatchIndicatorProps {
  label: string;
  value: number;
  icon: LucideIcon;
  description: string;
}

function MatchIndicator({ label, value, icon: Icon, description }: MatchIndicatorProps) {
  const getValueColor = (val: number) => {
    if (val >= 90) return 'text-green-600';
    if (val >= 75) return 'text-blue-600';
    if (val >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-lg font-bold ${getValueColor(value)}`}>
            {value}%
          </span>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{description}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Progress value={value} className="h-2" />
      </div>
    </motion.div>
  );
}

export function MatchMenu({ job, userSkills, userLocation, matchScore }: MatchMenuProps) {
  const matchedSkills = job.requiredSkills?.filter(skill =>
    userSkills.includes(skill)
  ) || [];

  const skillsMatchPercentage = job.requiredSkills?.length
    ? (matchedSkills.length / job.requiredSkills.length) * 100
    : 0;

  const locationMatch = userLocation === `${job.city}, ${job.country}`;
  const locationScore = locationMatch ? 100 :
    job.workType === "remote" ? 90 :
      job.country === userLocation.split(", ")[1] ? 70 : 40;

  const hiringSimulation = simulateHiring(matchScore);

  return (
    <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-violet-50/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-2">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Sparkles className="h-5 w-5 text-blue-500" />
          </motion.div>
          Análise de Compatibilidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <MatchIndicator
            label="Match de Habilidades"
            value={skillsMatchPercentage}
            icon={GraduationCap}
            description="Porcentagem de habilidades requeridas que você possui"
          />
          <MatchIndicator
            label="Match de Localização"
            value={locationScore}
            icon={MapPin}
            description="Compatibilidade com a localização do trabalho"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Match Score Total</span>
            <span className="font-medium text-blue-600">{matchScore}%</span>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="relative h-2 bg-gray-100 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${matchScore}%` }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-violet-500"
            />
          </motion.div>
        </div>

        {hiringSimulation.success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 rounded-lg border border-green-100"
          >
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Previsão de Contratação</span>
            </div>
            <p className="text-sm text-green-600">
              {hiringSimulation.message}
              <br />
              Tempo estimado: {hiringSimulation.timeToHire} dias
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}