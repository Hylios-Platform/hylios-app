import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface TutorialTooltipProps {
  step: number;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  onNext: () => void;
  onSkip: () => void;
  isLastStep?: boolean;
  className?: string;
}

export function TutorialTooltip({
  step,
  title,
  description,
  position,
  onNext,
  onSkip,
  isLastStep,
  className
}: TutorialTooltipProps) {
  const { t } = useTranslation();
  
  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        "absolute z-50 w-64 p-4 bg-popover text-popover-foreground rounded-lg shadow-lg",
        positionClasses[position],
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {step}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={onSkip}>
          {t('tutorial.skip')}
        </Button>
        <Button size="sm" onClick={onNext}>
          {isLastStep ? t('tutorial.finish') : t('tutorial.next')}
        </Button>
      </div>
    </motion.div>
  );
}
