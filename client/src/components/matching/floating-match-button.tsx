import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Zap } from "lucide-react";
import { calculateMatchScore, getMatchRecommendations } from "@/lib/matching-service";
import { useAuth } from "@/hooks/use-auth";

export function FloatingMatchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const userSkills = (user?.profileData as any)?.skills || [];
  const userLocation = (user?.profileData as any)?.location || "";
  const preferredWorkType = (user?.profileData as any)?.preferredWorkType || "remote";
  const userExperience = (user?.profileData as any)?.yearsOfExperience || 0;

  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  // Calcular matches em tempo real com recomendações
  const realTimeMatches = jobs?.map(job => ({
    job,
    score: calculateMatchScore(job, userSkills, userLocation, preferredWorkType, userExperience),
    recommendations: getMatchRecommendations(job, userSkills, calculateMatchScore(job, userSkills, userLocation, preferredWorkType, userExperience), userExperience)
  })).sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-full p-6 shadow-lg group"
        >
          <Sparkles className="h-8 w-8 transition-transform group-hover:scale-110" />
          {realTimeMatches && realTimeMatches.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center"
            >
              {realTimeMatches.length}
            </motion.span>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-6 w-96 z-50"
          >
            <Card className="border-blue-100 bg-white/90 backdrop-blur-sm shadow-xl dark:bg-slate-900/90">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Matches em Tempo Real
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {realTimeMatches?.map(({ job, score, recommendations }) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 cursor-pointer hover:shadow-md group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {job.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {job.city}, {job.country}
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-500 dark:text-gray-500">Tipo:</span>
                              <span className="text-blue-600 dark:text-blue-400 capitalize">
                                {job.workType}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                              {score}%
                            </span>
                            {score >= 80 && (
                              <motion.span
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1"
                              >
                                <Sparkles className="h-3 w-3" />
                                Match Perfeito!
                              </motion.span>
                            )}
                          </div>
                        </div>

                        {/* Recomendações personalizadas */}
                        <div className="mt-2 space-y-1">
                          {recommendations.map((rec, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className={`text-xs ${
                                rec.priority === 'high' 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : rec.priority === 'medium'
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-green-600 dark:text-green-400'
                              }`}
                            >
                              • {rec.message}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}