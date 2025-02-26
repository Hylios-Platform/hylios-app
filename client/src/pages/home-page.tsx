import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bitcoin, Building2, UserCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tutorial } from "@/components/onboarding/tutorial";
import { motion } from "framer-motion";
import { useTutorial } from "@/hooks/use-tutorial";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const tutorial = useTutorial();

  const MatchAnimation = () => (
    <div className="relative h-32 overflow-hidden my-8">
      {/* Linha de conexão animada */}
      <motion.div
        className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: [0, 1, 1, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Empresa */}
      <motion.div
        animate={{
          x: ["0%", "20%", "0%"],
          scale: [1, 1.1, 1],
          rotate: [0, 3, -3, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2"
      >
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full shadow-md">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-blue-600 font-medium">Empresa A</span>
        </div>
      </motion.div>

      {/* Efeito de Match Central */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 2
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative">
          <Sparkles className="h-8 w-8 text-amber-400" />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-amber-200 rounded-full blur-xl"
          />
        </div>
      </motion.div>

      {/* Profissional */}
      <motion.div
        animate={{
          x: ["100%", "80%", "100%"],
          scale: [1, 1.1, 1],
          rotate: [0, -3, 3, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2"
      >
        <div className="flex items-center gap-4">
          <span className="text-violet-600 font-medium">Profissional B</span>
          <div className="bg-violet-100 p-3 rounded-full shadow-md">
            <UserCheck className="h-6 w-6 text-violet-600" />
          </div>
        </div>
      </motion.div>

      {/* Partículas flutuantes */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-400"
          initial={{ 
            y: "100%",
            x: `${30 + i * 20}%`,
            opacity: 0 
          }}
          animate={{
            y: [100, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  if (user?.userType === "company") {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('home.welcome')}
            </h1>
            <p className="text-xl text-blue-400 mb-10">
              {t('home.subtitle')}
            </p>
            <MatchAnimation />
            <Link href="/post-job">
              <Button size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                {t('navigation.postJob')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Tutorial />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="welcome-section mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('home.welcome')}
            </h1>
            <p className="text-xl text-blue-400 mb-6">
              {t('home.subtitle')}
            </p>
            <MatchAnimation />
            <Button 
              variant="secondary" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              onClick={() => tutorial.startTutorial()}
            >
              {t('tutorial.start')}
            </Button>
          </motion.div>

          <motion.div 
            className="grid gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div 
              variants={item}
              className="kyc-section group relative overflow-hidden rounded-xl border border-blue-100 bg-white p-6 shadow-md transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-emerald-50 p-3">
                  <UserCheck className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-700">{t('jobs.startVerification')}</h2>
                  <p className="text-blue-400 mb-4">
                    {t('jobs.completeKyc')}
                  </p>
                  <Button variant="outline" className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200 shadow-sm">
                    {t('jobs.startVerification')}
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="jobs-section group relative overflow-hidden rounded-xl border border-blue-100 bg-white p-6 shadow-md transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-50 p-3">
                  <Building2 className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-700">{t('navigation.jobs')}</h2>
                  <p className="text-blue-400 mb-4">
                    {t('jobs.findOpportunities')}
                  </p>
                  <Link href="/jobs">
                    <Button variant="outline" className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200 shadow-sm">
                      {t('jobs.viewJobs')}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="payment-section group relative overflow-hidden rounded-xl border border-blue-100 bg-white p-6 shadow-md transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-50 p-3">
                  <Bitcoin className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-700">{t('jobs.receivePayments')}</h2>
                  <p className="text-blue-400">
                    {t('jobs.receivePayments')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}