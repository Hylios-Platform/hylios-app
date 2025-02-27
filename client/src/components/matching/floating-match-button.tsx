import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { calculateMatchScore } from "@/lib/matching-service";
import { useAuth } from "@/hooks/use-auth";

export function FloatingMatchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const userSkills = (user?.profileData as any)?.skills || [];
  const userLocation = (user?.profileData as any)?.location || "";
  const preferredWorkType = (user?.profileData as any)?.preferredWorkType || "remote";

  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  // Calcular matches em tempo real
  const realTimeMatches = jobs?.map(job => ({
    job,
    score: calculateMatchScore(job, userSkills, userLocation, preferredWorkType)
  })).sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50"
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 w-80 z-50"
          >
            <Card className="border-blue-100 bg-white shadow-xl">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-blue-600">Matches em Tempo Real</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {realTimeMatches?.map(({ job, score }) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-blue-50/50 rounded-lg border border-blue-100"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.city}, {job.country}</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {score}%
                        </span>
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
