import { Building2 } from "lucide-react";
import { motion } from "framer-motion";

export function MarqueeSponsors() {
  return (
    <div className="w-full bg-blue-50/50 py-2 relative">
      {/* Gradientes para fade nas bordas */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-blue-50/50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-50/50 to-transparent z-10" />

      <div className="overflow-hidden">
        <motion.div 
          className="flex items-center justify-center space-x-8 whitespace-nowrap"
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0
          }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center space-x-8 mx-8">
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
                7% na primeira compra
              </motion.span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}