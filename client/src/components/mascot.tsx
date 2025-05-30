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
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20,
      duration: 0.6 
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.8,
    transition: { duration: 0.3 }
  }
};

const bubbleVariants = {
  hidden: { opacity: 0, scale: 0.8, x: -20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    x: 0,
    transition: { 
      delay: 0.2, 
      type: "spring", 
      stiffness: 300, 
      damping: 20,
      duration: 0.6 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    x: -20,
    transition: { duration: 0.3 }
  }
};

export function Mascot() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [showTips, setShowTips] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    setIsVisible(true);
    setShowTips(true);

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

  useEffect(() => {
    if (!tips.length || !showTips) return;

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [tips, showTips]);

  if (!isVisible || !tips.length) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 flex items-end gap-2 z-50">
        {showTips && (
          <motion.div
            variants={bubbleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-[200px] bg-gradient-to-br from-indigo-50/90 to-purple-50/90 rounded-xl p-3 shadow-lg border border-indigo-200/50 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start gap-2">
              <p className="text-xs text-indigo-700">{tips[currentTip]}</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-indigo-100/50"
                onClick={() => setShowTips(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {tips.length > 1 && (
              <div className="flex justify-center gap-1 mt-2">
                {tips.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 w-1 rounded-full transition-colors ${
                      index === currentTip ? 'bg-indigo-500' : 'bg-indigo-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          variants={mascotVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 }
          }}
          className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer select-none relative overflow-hidden"
          onClick={() => {
            if (!showTips) {
              setShowTips(true);
            } else {
              setShowTips(false);
            }
          }}
        >
          <span className="text-xl transform -scale-x-100">🐲</span>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 pointer-events-none" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}