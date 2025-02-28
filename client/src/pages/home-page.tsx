import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, UserCheck, Bitcoin, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tutorial } from "@/components/onboarding/tutorial";
import { motion } from "framer-motion";
import { useTutorial } from "@/hooks/use-tutorial";
import { JobSwipe } from "@/components/job-swipe";
import { MarqueeSponsors } from "@/components/marquee-sponsors";

const MatchAnimation = () => (
  <div className="relative h-32 overflow-hidden my-8">
    <motion.div
      className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600"
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
        <span className="text-blue-600 font-medium">Empresa</span>
      </div>
    </motion.div>

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
        <Bitcoin className="h-8 w-8 text-amber-400" />
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
        <span className="text-violet-600 font-medium">Profissional</span>
        <div className="bg-violet-100 p-3 rounded-full shadow-md">
          <UserCheck className="h-6 w-6 text-violet-600" />
        </div>
      </div>
    </motion.div>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const tutorial = useTutorial();

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

  return (
    <div className="min-h-screen bg-white">
      <Tutorial />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="welcome-section text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {t('home.welcome')}
            </h1>
            <p className="text-xl text-blue-400 mb-8">
              {t('home.subtitle')}
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md mb-8"
              onClick={() => tutorial.startTutorial()}
            >
              {t('tutorial.start')}
            </Button>
          </motion.div>

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
            <MatchAnimation />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 mb-12"
          >
            <JobSwipe />
          </motion.div>

          {user && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6"
            >
              <motion.div
                variants={item}
                className="kyc-section group relative overflow-hidden rounded-xl border border-blue-100 bg-white p-6 shadow-md transition-all hover:shadow-lg"
              >
                <Link href="/kyc-verification">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-emerald-50 p-3">
                      <UserCheck className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-3 text-gray-900">{t('jobs.startVerification')}</h2>
                      <p className="text-gray-600 mb-4">
                        {t('jobs.completeKyc')}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
                      >
                        {t('jobs.startVerification')}
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                variants={item}
                className="payment-section group relative overflow-hidden rounded-xl border border-blue-100 bg-white p-6 shadow-md transition-all hover:shadow-lg"
              >
                <Link href="/payments">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-amber-50 p-3">
                      <Bitcoin className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-3 text-gray-900">{t('jobs.receivePayments')}</h2>
                      <p className="text-gray-600">
                        {t('jobs.receivePayments')}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}