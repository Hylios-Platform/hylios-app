import { motion } from "framer-motion";
import { Job } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MapPin, Coins } from "lucide-react";

export function FloatingJobs() {
  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="relative h-48 overflow-hidden my-8">
      {jobs?.map((job, index) => (
        <motion.div
          key={job.id}
          className="absolute bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-blue-100"
          initial={{ 
            x: "-100%",
            y: 20 + (index * 40) % 120
          }}
          animate={{
            x: ["-100%", "100%"],
            y: [
              20 + (index * 40) % 120,
              20 + ((index * 40) + 60) % 120,
              20 + (index * 40) % 120
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: index * 5,
            ease: "linear",
            y: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-amber-400" />
              <span className="text-gray-700">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: job.currency
                }).format(parseFloat(job.amount))}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span className="text-gray-700">{job.location}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
