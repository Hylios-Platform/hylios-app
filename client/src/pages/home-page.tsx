import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, UserCheck, Bitcoin, Sparkles, Globe, Users, Trophy, Target, Rocket, Shield, Star, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tutorial } from "@/components/onboarding/tutorial";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorial } from "@/hooks/use-tutorial";
import { JobSwipe } from "@/components/job-swipe";
import { MarqueeSponsors } from "@/components/marquee-sponsors";
import { ChatBot } from "@/components/support/chat-bot";

// Componente para News Banner (público)
const NewsBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500 to-violet-500 text-white p-4 rounded-xl shadow-lg mb-8"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MessageSquare className="h-6 w-6" />
          <p className="text-sm font-medium">
            Novo! Transações instantâneas na própria rede Hylios! Pagamentos seguros em Bitcoin com confirmação imediata.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-white text-blue-500 hover:bg-blue-50 border-white"
        >
          Saiba Mais
        </Button>
      </div>
    </motion.div>
  );
};

// Componentes públicos mostrados mesmo sem autenticação
const PublicStats = () => {
  const stats = [
    { label: 'Profissionais', value: '10k+', icon: Users },
    { label: 'Países', value: '25+', icon: Globe },
    { label: 'Match Rate', value: '95%', icon: Target },
    { label: 'Projetos', value: '5k+', icon: Trophy },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-3"
            >
              <Icon className="h-8 w-8 text-blue-500" />
            </motion.div>
            <motion.span
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {stat.value}
            </motion.span>
            <span className="text-gray-600 mt-1">{stat.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

const PublicFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: 'Segurança Blockchain',
      description: 'Transações seguras e transparentes com tecnologia blockchain'
    },
    {
      icon: Rocket,
      title: 'Matchmaking IA',
      description: 'Sistema avançado de correspondência com Machine Learning e NLP'
    },
    {
      icon: Bitcoin,
      title: 'Pagamentos Bitcoin',
      description: 'Pagamentos exclusivos e seguros em Bitcoin (BTC)'
    },
    {
      icon: Sparkles,
      title: 'UX Inovadora',
      description: 'Interface moderna e intuitiva para melhor experiência'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 my-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="group p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            {/* Background Gradient Animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-violet-50/50"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="relative flex items-center gap-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`p-3 rounded-full ${
                  feature.title === 'Matchmaking IA'
                    ? 'bg-gradient-to-r from-violet-100 to-blue-100'
                    : 'bg-blue-50'
                } group-hover:bg-blue-100 transition-colors`}
              >
                <Icon className={`h-6 w-6 ${
                  feature.title === 'Matchmaking IA'
                    ? 'text-violet-500'
                    : 'text-blue-500'
                }`} />

                {/* Partículas animadas para o Matchmaking IA */}
                {feature.title === 'Matchmaking IA' && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-violet-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.8, 0, 0.8],
                          x: [0, (i + 1) * 10, 0],
                          y: [0, (i + 1) * -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.div>
              <div>
                <h3 className={`text-lg font-semibold ${
                  feature.title === 'Matchmaking IA'
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent'
                    : 'text-gray-900 group-hover:text-blue-600'
                } transition-colors`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const tutorial = useTutorial();

  return (
    <div className="min-h-screen bg-white">
      <Tutorial />
      <ChatBot />
      <div className="container mx-auto px-4 py-8">
        <NewsBanner />

        <div className="max-w-2xl mx-auto">
          <motion.div
            className="welcome-section text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="mb-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative w-24 h-24 mx-auto"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 opacity-20 blur-xl" />
                <div className="relative flex items-center justify-center h-full">
                  <Building2 className="h-12 w-12 text-blue-600" />
                </div>
              </motion.div>
            </motion.div>

            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Bem-vindo ao Hylios
            </h1>
            <p className="text-xl text-blue-400 mb-8">
              A plataforma que conecta talentos globais através de Bitcoin
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md mb-8"
              onClick={() => tutorial.startTutorial()}
            >
              Começar Tour
            </Button>
          </motion.div>

          <PublicStats />
          <PublicFeatures />

          {/* Job Swipe Section - disponível publicamente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 mb-12"
          >
            <JobSwipe />
          </motion.div>

          {/* Features protegidas - só aparecem para usuários autenticados */}
          {user && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <MarqueeSponsors />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Define or import MatchAnimation component */}
                <div>Match Animation Placeholder</div>
              </motion.div>
              {/* Define or import the Features component */}
              {/* Example placeholder: */}
              <div>Features Placeholder</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;