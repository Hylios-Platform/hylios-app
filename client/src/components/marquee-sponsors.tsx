import { Building2 } from "lucide-react";
import { motion } from "framer-motion";

export function MarqueeSponsors() {
  return (
    <div className="w-full bg-blue-50/50 py-2 overflow-hidden">
      <motion.div 
        className="flex items-center justify-center space-x-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Building2 className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-700">GoblueDigital</span>
        </motion.div>
        <span className="text-sm text-blue-500">•</span>
        <motion.span 
          className="text-sm text-blue-600"
          animate={{ 
            opacity: [1, 0.7, 1],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          7% off na primeira contratação
        </motion.span>
      </motion.div>
    </div>
  );
}