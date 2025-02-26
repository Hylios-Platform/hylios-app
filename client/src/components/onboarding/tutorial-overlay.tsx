import { motion } from "framer-motion";

interface TutorialOverlayProps {
  children: React.ReactNode;
}

export function TutorialOverlay({ children }: TutorialOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-blue-50/50 backdrop-blur-sm"
    >
      <div className="relative z-50">
        {children}
      </div>
    </motion.div>
  );
}