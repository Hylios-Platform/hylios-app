import { motion } from "framer-motion";
import { Building2, Gift } from "lucide-react";

export function MarqueeSponsors() {
  const messages = [
    <div key="sponsor" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
      <Building2 className="h-5 w-5 text-blue-500" />
      <span className="font-medium text-blue-700">GoblueDigital</span>
      <span className="text-blue-500">- Parceiro Oficial de Transformação Digital</span>
    </div>,
    <div key="promo1" className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-full">
      <Gift className="h-5 w-5 inline-block mr-2" />
      50% de desconto na primeira contratação!
    </div>,
    <div key="promo2" className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-full">
      Pagamentos em Bitcoin disponíveis!
    </div>
  ];

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 py-3 overflow-hidden">
      <motion.div
        className="flex items-center gap-8 whitespace-nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {[...messages, ...messages].map((message, i) => (
          <div key={i} className="flex-shrink-0">
            {message}
          </div>
        ))}
      </motion.div>
    </div>
  );
}