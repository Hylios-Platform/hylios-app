import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Clock, Coins, Heart, X, Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Job } from "@shared/schema";

// Mock data usando os campos corretos do tipo Job
const mockJobs: Job[] = [
  {
    id: 1,
    title: "Desenvolvedor Full Stack React/Node",
    description: "Desenvolvimento de aplicações web modernas usando React e Node.js",
    companyId: 1,
    currency: "EUR",
    amount: "6000",
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
    currency: "EUR",
    amount: "5500",
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
    currency: "EUR",
    amount: "7000",
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
  const [likedJobs, setLikedJobs] = useState<number[]>([]);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [matchScore, setMatchScore] = useState(85);
  const [showTutorial, setShowTutorial] = useState(true);

  const currentJob = mockJobs[currentIndex];

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (currentIndex + newDirection >= 0 && currentIndex + newDirection < mockJobs.length) {
      setCurrentIndex(currentIndex + newDirection);
      setSwipeProgress(((currentIndex + newDirection + 1) / mockJobs.length) * 100);
      setMatchScore(Math.floor(Math.random() * (98 - 75 + 1)) + 75);
    }
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const xOffset = info.offset.x;
    setRotateValue(xOffset * 0.1);
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
    setRotateValue(0);
  };

  const handleMatch = () => {
    setLikedJobs([...likedJobs, currentJob.id]);
    setDirection("right");
    paginate(1);
  };

  const handleSkip = () => {
    setDirection("left");
    paginate(1);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-r from-blue-50 to-violet-50 p-4 rounded-xl mb-6 border border-blue-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-600">
                Deslize para a direita (❤️) para curtir ou para a esquerda (✖️) para pular
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTutorial(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              Entendi
            </Button>
          </div>
        </motion.div>
      )}

      <div className="relative h-[500px] w-full perspective-1000">
        {/* Setas de navegação */}
        <div className="absolute inset-y-0 left-0 flex items-center -ml-12 z-10">
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            <ChevronLeft
              className="h-8 w-8 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={() => paginate(-1)}
            />
          </motion.div>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center -mr-12 z-10">
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            <ChevronRight
              className="h-8 w-8 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={() => paginate(1)}
            />
          </motion.div>
        </div>

        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute w-full h-full"
            initial={{
              x: direction === "right" ? -300 : 300,
              opacity: 0,
              scale: 0.95,
              rotateY: direction === "right" ? -30 : 30
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
              rotateY: 0,
              rotate: rotateValue
            }}
            exit={{
              x: direction === "right" ? 300 : -300,
              opacity: 0,
              scale: 0.95,
              rotateY: direction === "right" ? 30 : -30
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.02 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="w-full h-full overflow-hidden bg-gradient-to-b from-white to-blue-50/20 border-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100/30">
                <CardTitle className="text-xl font-bold text-gray-800">
                  {currentJob.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-4 w-4 text-blue-400" />
                  <span>Empresa {currentJob.companyId}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 text-gray-300" />
                  <span className="text-sm text-gray-500 ml-1">(4.0)</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span>{currentJob.city}, {currentJob.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="capitalize">{currentJob.workType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Coins className="h-4 w-4 text-blue-400" />
                    <span>{currentJob.amount} {currentJob.currency} (≈0.15 BTC)</span>
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
                      <motion.span
                        key={skill}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="px-2 py-1 bg-blue-50 text-blue-500 rounded-full text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100">
                  <motion.div 
                    className="relative"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <p className="text-sm text-blue-400">
                      <span className="font-medium">Match Score:</span> {matchScore}%
                    </p>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${matchScore}%`,
                          background: [
                            "linear-gradient(to right, #93c5fd, #60a5fa, #93c5fd)",
                            "linear-gradient(to right, #60a5fa, #93c5fd, #60a5fa)",
                            "linear-gradient(to right, #93c5fd, #60a5fa, #93c5fd)"
                          ]
                        }}
                        transition={{ 
                          duration: 0.8, 
                          ease: "easeOut",
                          background: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-16 h-16 bg-rose-50 hover:bg-rose-100 border-rose-200 hover:border-rose-300 transition-colors duration-200 group relative"
            onClick={handleSkip}
          >
            <X className="h-8 w-8 text-rose-500 group-hover:text-rose-600 transition-colors" />
            <motion.div
              className="absolute inset-0 rounded-full bg-rose-200/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-16 h-16 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-300 transition-colors duration-200 group relative"
            onClick={handleMatch}
          >
            <Heart className="h-8 w-8 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-200/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </Button>
        </motion.div>
      </div>

      {/* Indicador de progresso melhorado */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Vaga {currentIndex + 1} de {mockJobs.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(swipeProgress)}% concluído
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400"
            initial={{ width: 0 }}
            animate={{ 
              width: `${swipeProgress}%`,
              background: [
                "linear-gradient(to right, #60a5fa, #a78bfa, #60a5fa)",
                "linear-gradient(to right, #a78bfa, #60a5fa, #a78bfa)",
                "linear-gradient(to right, #60a5fa, #a78bfa, #60a5fa)"
              ]
            }}
            transition={{ 
              duration: 0.3,
              background: {
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {mockJobs.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentIndex ? "bg-blue-400" : "bg-gray-200"
            }`}
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: index === currentIndex ? [1, 1.2, 1] : 1,
              opacity: index === currentIndex ? [0.7, 1, 0.7] : 0.5
            }}
            transition={{ 
              duration: 1.5,
              repeat: index === currentIndex ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}