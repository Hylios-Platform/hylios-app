import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const mascotVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

const bubbleVariants = {
  hidden: { opacity: 0, scale: 0.8, x: -20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    x: 0,
    transition: { delay: 0.2, type: "spring", stiffness: 200, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    x: -20,
    transition: { duration: 0.2 }
  }
};

export function Mascot() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    // Reset visibility when location changes
    setIsVisible(true);

    // Get tips based on current location
    const pageTips = [];
    if (location === "/") {
      pageTips.push(
        t('mascot.tips.home.welcome'),
        t('mascot.tips.home.explore'),
        t('mascot.tips.home.profile')
      );
    } else if (location === "/jobs") {
      pageTips.push(
        t('mascot.tips.jobs.search'),
        t('mascot.tips.jobs.apply'),
        t('mascot.tips.jobs.status')
      );
    } else if (location === "/profile") {
      pageTips.push(
        t('mascot.tips.profile.kyc'),
        t('mascot.tips.profile.skills'),
        t('mascot.tips.profile.portfolio')
      );
    }
    setTips(pageTips);
    setCurrentTip(0);
  }, [location, t]);

  // Rotate tips every 10 seconds
  useEffect(() => {
    if (!tips.length) return;

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [tips]);

  if (!isVisible || !tips.length) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 flex items-end gap-3 z-50">
        {/* Tip Bubble */}
        <motion.div
          variants={bubbleVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-xs bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-4 shadow-lg border border-blue-100"
        >
          <div className="flex justify-between items-start gap-4">
            <p className="text-sm text-gray-600">{tips[currentTip]}</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-blue-100/50"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {tips.length > 1 && (
            <div className="flex justify-center gap-1 mt-2">
              {tips.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    index === currentTip ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Mascot */}
        <motion.div
          variants={mascotVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover={{ scale: 1.1 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-400 to-violet-400 rounded-full flex items-center justify-center shadow-lg cursor-pointer select-none"
          onClick={() => setIsVisible(true)}
        >
          <span className="text-2xl transform -scale-x-100">🧌</span>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}