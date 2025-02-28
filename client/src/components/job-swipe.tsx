import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Clock, Coins, Heart, X } from "lucide-react";
import { Job } from "@shared/schema";

// Mock data usando os campos corretos do tipo Job
const mockJobs: Job[] = [
  {
    id: 1,
    title: "Desenvolvedor Full Stack React/Node",
    description: "Desenvolvimento de aplicações web modernas usando React e Node.js",
    companyId: 1,
    amount: "6000 EUR (≈0.15 BTC)",
    country: "Portugal",
    city: "Lisboa",
    workType: "remote",
    requiredSkills: ["React", "Node.js", "TypeScript"],
    status: "open",
    assignedTo: null,
    createdAt: new Date()
  },
  {
    id: 2,
    title: "UI/UX Designer Senior",
    description: "Criação de interfaces intuitivas e experiências memoráveis",
    companyId: 2,
    amount: "5500 EUR (≈0.14 BTC)",
    country: "Espanha",
    city: "Barcelona",
    workType: "hybrid",
    requiredSkills: ["Figma", "Adobe XD", "User Research"],
    status: "open",
    assignedTo: null,
    createdAt: new Date()
  },
  {
    id: 3,
    title: "DevOps Engineer",
    description: "Automatização e gerenciamento de infraestrutura cloud",
    companyId: 3,
    amount: "7000 EUR (≈0.18 BTC)",
    country: "Alemanha",
    city: "Berlim",
    workType: "onsite",
    requiredSkills: ["AWS", "Docker", "Kubernetes"],
    status: "open",
    assignedTo: null,
    createdAt: new Date()
  }
];

export function JobSwipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const currentJob = mockJobs[currentIndex];

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (currentIndex + newDirection >= 0 && currentIndex + newDirection < mockJobs.length) {
      setCurrentIndex(currentIndex + newDirection);
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      setDirection("left");
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      setDirection("right");
      paginate(-1);
    }
  };

  const handleMatch = () => {
    console.log("Match com a vaga:", currentJob.id);
    paginate(1);
  };

  const handleSkip = () => {
    paginate(1);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative h-[500px] w-full">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            className="absolute w-full h-full"
            initial={{
              x: direction === "right" ? -300 : 300,
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
              rotateZ: 0
            }}
            exit={{
              x: direction === "right" ? 300 : -300,
              opacity: 0,
              scale: 0.95,
              rotateZ: direction === "right" ? 5 : -5
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
          >
            <Card className="w-full h-full overflow-hidden bg-gradient-to-b from-white to-gray-50 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-xl font-bold text-gray-800">{currentJob.title}</CardTitle>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  <span>Empresa {currentJob.companyId}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    <span>{currentJob.city}, {currentJob.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span className="capitalize">{currentJob.workType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Coins className="h-4 w-4 text-indigo-500" />
                    <span>{currentJob.amount}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Descrição</h3>
                  <p className="text-gray-600">{currentJob.description}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Habilidades Necessárias</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentJob.requiredSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16 bg-rose-50 hover:bg-rose-100 border-rose-200 hover:border-rose-300 transition-colors duration-200 group"
          onClick={handleSkip}
        >
          <X className="h-8 w-8 text-rose-500 group-hover:text-rose-600 transition-colors" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-300 transition-colors duration-200 group"
          onClick={handleMatch}
        >
          <Heart className="h-8 w-8 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
        </Button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {mockJobs.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}