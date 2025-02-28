import { motion } from "framer-motion";
import { Building2, Gift, Sparkles } from "lucide-react";

export function MarqueeSponsors() {
  const sponsors = [
    {
      name: "GoblueDigital",
      url: "https://www.goblue.pt",
      description: "Parceiro Oficial de Transformação Digital"
    }
  ];

  const promotions = [
    "🚀 Ganhe 50% de desconto na primeira contratação!",
    "💎 Profissionais verificados recebem benefícios exclusivos",
    "🌟 Novo: Pagamentos em Bitcoin disponíveis!"
  ];

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 py-3 overflow-hidden relative">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ 
          x: "-100%",
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="flex items-center gap-12 absolute whitespace-nowrap"
      >
        {sponsors.map((sponsor, index) => (
          <a 
            key={`sponsor-${index}`}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow group"
          >
            <Building2 className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700 group-hover:text-blue-800 transition-colors">
              {sponsor.name}
            </span>
            <span className="text-sm text-blue-500">
              - {sponsor.description}
            </span>
          </a>
        ))}

        {promotions.map((promo, index) => (
          <div 
            key={`promo-${index}`}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-full"
          >
            {index === 0 ? <Gift className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            <span className="font-medium">{promo}</span>
          </div>
        ))}

        {/* Repetir para criar um efeito contínuo */}
        {sponsors.map((sponsor, index) => (
          <a 
            key={`sponsor-repeat-${index}`}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow group"
          >
            <Building2 className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700 group-hover:text-blue-800 transition-colors">
              {sponsor.name}
            </span>
            <span className="text-sm text-blue-500">
              - {sponsor.description}
            </span>
          </a>
        ))}

        {promotions.map((promo, index) => (
          <div 
            key={`promo-repeat-${index}`}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-full"
          >
            {index === 0 ? <Gift className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            <span className="font-medium">{promo}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
