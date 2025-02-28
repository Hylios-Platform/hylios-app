import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Slide {
  title: string;
  content: string;
  image?: string;
}

export default function PitchPresentation() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  // Exemplo de slides - isso seria carregado dinamicamente
  const slides: Slide[] = [
    {
      title: "Bem-vindo ao meu Pitch",
      content: "Sou um profissional especializado em desenvolvimento web"
    },
    {
      title: "Minhas Habilidades",
      content: "React, Node.js, TypeScript, e muito mais"
    },
    {
      title: "Projetos Anteriores",
      content: "Já trabalhei em diversos projetos interessantes"
    }
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (
      (currentSlide === 0 && newDirection === -1) ||
      (currentSlide === slides.length - 1 && newDirection === 1)
    ) {
      return;
    }
    setDirection(newDirection);
    setCurrentSlide(currentSlide + newDirection);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute z-10 left-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => paginate(-1)}
            disabled={currentSlide === 0}
            className="h-12 w-12 rounded-full bg-white/80 hover:bg-white shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute z-10 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => paginate(1)}
            disabled={currentSlide === slides.length - 1}
            className="h-12 w-12 rounded-full bg-white/80 hover:bg-white shadow-lg"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full max-w-4xl px-4"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mx-auto">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
              >
                {slides[currentSlide].title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600"
              >
                {slides[currentSlide].content}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-blue-500"
                  : "w-2 bg-blue-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
