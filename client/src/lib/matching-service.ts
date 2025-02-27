import { Job } from "@shared/schema";

interface MatchingWeights {
  skills: number;
  location: number;
  workType: number;
  experience: number;
  culture: number;
}

interface MatchRecommendation {
  type: 'skill' | 'location' | 'workType' | 'experience' | 'culture';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

const DEFAULT_WEIGHTS: MatchingWeights = {
  skills: 0.35, // 35% do score
  location: 0.20, // 20% do score
  workType: 0.15, // 15% do score
  experience: 0.20, // 20% do score
  culture: 0.10 // 10% do score
};

export function calculateMatchScore(
  job: Job,
  userSkills: string[],
  userLocation: string,
  userPreferredWorkType: string,
  userExperience: number = 0,
  culturalPreferences: string[] = []
): number {
  // Match de habilidades
  const requiredSkills = job.requiredSkills || [];
  const matchedSkills = requiredSkills.filter(skill => userSkills.includes(skill));
  const skillsScore = requiredSkills.length > 0 
    ? (matchedSkills.length / requiredSkills.length) * 100 
    : 100;

  // Match de localização
  const jobLocation = `${job.city}, ${job.country}`;
  const locationScore = userLocation === jobLocation ? 100 : 
    job.workType === "remote" ? 90 : // Remoto tem peso maior
    job.country === userLocation.split(", ")[1] ? 70 : // Mesmo país
    40; // Diferente país

  // Match de tipo de trabalho
  const workTypeScore = job.workType === userPreferredWorkType ? 100 :
    job.workType === "hybrid" && (userPreferredWorkType === "remote" || userPreferredWorkType === "onsite") ? 80 :
    job.workType === "remote" && userPreferredWorkType === "hybrid" ? 70 :
    40;

  // Match de experiência (simulado)
  const experienceScore = userExperience >= 2 ? 100 : // Usando valor fixo de 2 anos como base
    userExperience >= 1 ? 70 :
    40;

  // Match cultural (simulado)
  const culturalScore = culturalPreferences.length > 0 ? 80 : 60;

  // Cálculo do score final ponderado
  const finalScore = (
    skillsScore * DEFAULT_WEIGHTS.skills +
    locationScore * DEFAULT_WEIGHTS.location +
    workTypeScore * DEFAULT_WEIGHTS.workType +
    experienceScore * DEFAULT_WEIGHTS.experience +
    culturalScore * DEFAULT_WEIGHTS.culture
  );

  return Math.round(finalScore);
}

export function getMatchRecommendations(
  job: Job,
  userSkills: string[],
  matchScore: number,
  userExperience: number = 0
): MatchRecommendation[] {
  const recommendations: MatchRecommendation[] = [];
  const requiredSkills = job.requiredSkills || [];
  const missingSkills = requiredSkills.filter(skill => !userSkills.includes(skill));

  // Recomendações de habilidades
  if (missingSkills.length > 0) {
    recommendations.push({
      type: 'skill',
      message: `Desenvolva habilidades em: ${missingSkills.join(", ")}`,
      priority: 'high'
    });
  }

  // Recomendações baseadas no score
  if (matchScore < 60) {
    recommendations.push({
      type: 'experience',
      message: "Procure vagas mais alinhadas com seu perfil atual",
      priority: 'high'
    });
  } else if (matchScore < 80) {
    recommendations.push({
      type: 'experience',
      message: "Você tem um bom potencial para esta vaga",
      priority: 'medium'
    });
  } else {
    recommendations.push({
      type: 'experience',
      message: "Você tem um excelente match com esta vaga!",
      priority: 'low'
    });
  }

  // Recomendações de experiência
  if (userExperience < 2) { // Usando valor fixo de 2 anos como base
    recommendations.push({
      type: 'experience',
      message: "Busque mais experiência prática na área",
      priority: 'medium'
    });
  }

  return recommendations;
}

export function simulateHiring(matchScore: number): {
  success: boolean;
  timeToHire: number;
  message: string;
} {
  // Simulação de processo de contratação baseado no match score
  if (matchScore >= 90) {
    return {
      success: true,
      timeToHire: 2, // 2 dias
      message: "Match perfeito! Processo acelerado de contratação."
    };
  } else if (matchScore >= 80) {
    return {
      success: true,
      timeToHire: 5, // 5 dias
      message: "Ótimo match! Processo regular de contratação."
    };
  } else if (matchScore >= 70) {
    return {
      success: true,
      timeToHire: 10, // 10 dias
      message: "Bom match! Processo estendido de contratação."
    };
  }

  return {
    success: false,
    timeToHire: 0,
    message: "Match insuficiente para contratação automática."
  };
}