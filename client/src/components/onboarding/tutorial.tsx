import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TutorialTooltip } from "./tutorial-tooltip";
import { TutorialOverlay } from "./tutorial-overlay";
import { useTutorial } from "@/hooks/use-tutorial";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Tutorial() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isActive, currentStep, hasSeen, startTutorial, nextStep, skipTutorial, resetTutorial } = useTutorial();

  useEffect(() => {
    // Mostrar o tutorial apenas para novos usuários profissionais
    if (user?.userType === "professional" && !hasSeen) {
      startTutorial();
    }
  }, [user, hasSeen, startTutorial]);

  const steps = [
    {
      title: t('tutorial.steps.welcome.title'),
      description: t('tutorial.steps.welcome.description'),
      position: "bottom" as const,
      target: ".welcome-section"
    },
    {
      title: t('tutorial.steps.kyc.title'),
      description: t('tutorial.steps.kyc.description'),
      position: "right" as const,
      target: ".kyc-section"
    },
    {
      title: t('tutorial.steps.jobs.title'),
      description: t('tutorial.steps.jobs.description'),
      position: "left" as const,
      target: ".jobs-section"
    },
    {
      title: t('tutorial.steps.apply.title'),
      description: t('tutorial.steps.apply.description'),
      position: "bottom" as const,
      target: ".apply-section"
    },
    {
      title: t('tutorial.steps.payment.title'),
      description: t('tutorial.steps.payment.description'),
      position: "top" as const,
      target: ".payment-section"
    }
  ];

  const currentStepData = steps[currentStep - 1];

  if (!isActive || !currentStepData) return null;

  return (
    <AnimatePresence>
      <TutorialOverlay>
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="relative">
            <TutorialTooltip
              step={currentStep}
              title={currentStepData.title}
              description={currentStepData.description}
              position={currentStepData.position}
              onNext={() => {
                if (currentStep === steps.length) {
                  resetTutorial();
                } else {
                  nextStep();
                }
              }}
              onSkip={skipTutorial}
              isLastStep={currentStep === steps.length}
            />
          </div>
        </div>
      </TutorialOverlay>
    </AnimatePresence>
  );
}

export function TutorialButton() {
  const { t } = useTranslation();
  const { startTutorial } = useTutorial();

  return (
    <Button variant="outline" onClick={startTutorial}>
      {t('tutorial.start')}
    </Button>
  );
}
