import { Job } from "@shared/schema";

interface MatchingWeights {
  skills: number;
  location: number;
  workType: number;
}

const DEFAULT_WEIGHTS: MatchingWeights = {
  skills: 0.6, // 60% do score
  location: 0.25, // 25% do score
  workType: 0.15 // 15% do score
};

export function calculateMatchScore(
  job: Job,
  userSkills: string[],
  userLocation: string,
  userPreferredWorkType: string,
  weights: MatchingWeights = DEFAULT_WEIGHTS
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
    job.workType === "remote" ? 80 : // Se for remoto, ainda é um bom match
    job.country === userLocation.split(", ")[1] ? 60 : // Mesmo país
    30; // Diferente país

  // Match de tipo de trabalho
  const workTypeScore = job.workType === userPreferredWorkType ? 100 :
    job.workType === "hybrid" ? 70 : // Híbrido é parcialmente compatível com ambos
    30; // Diferente preferência

  // Cálculo do score final ponderado
  const finalScore = (
    skillsScore * weights.skills +
    locationScore * weights.location +
    workTypeScore * weights.workType
  );

  return Math.round(finalScore);
}

export function getMatchRecommendations(
  job: Job,
  userSkills: string[],
  matchScore: number
): string[] {
  const recommendations: string[] = [];
  const requiredSkills = job.requiredSkills || [];
  const missingSkills = requiredSkills.filter(skill => !userSkills.includes(skill));

  if (missingSkills.length > 0) {
    recommendations.push(`Desenvolva habilidades em: ${missingSkills.join(", ")}`);
  }

  if (matchScore < 60) {
    recommendations.push("Procure vagas mais alinhadas com seu perfil atual");
  } else if (matchScore < 80) {
    recommendations.push("Você tem um bom potencial para esta vaga");
  } else {
    recommendations.push("Você tem um excelente match com esta vaga!");
  }

  return recommendations;
}
