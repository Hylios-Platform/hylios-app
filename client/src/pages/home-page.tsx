import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, UserCheck, Bitcoin, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tutorial } from "@/components/onboarding/tutorial";
import { motion } from "framer-motion";
import { useTutorial } from "@/hooks/use-tutorial";
import { UserProgress } from "@/components/user-progress";
import { FloatingJobs } from "@/components/floating-jobs";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@shared/schema";
import { calculateMatchScore } from "@/lib/matching-service";
import { ProfessionalStats } from "@/components/professional-stats";
import { JobSwipe } from "@/components/job-swipe";
import { MarqueeSponsors } from "@/components/marquee-sponsors";

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

  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const userSkills = (user?.profileData as any)?.skills || [];
  const userLocation = (user?.profileData as any)?.location || "";
  const preferredWorkType = (user?.profileData as any)?.preferredWorkType || "remote";

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
          <span className="text-blue-600 font-medium">Empresa A</span>
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

      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`bitcoin-${i}`}
          className="absolute"
          initial={{ x: "20%", y: "50%", opacity: 0 }}
          animate={{
            x: ["20%", "80%"],
            y: ["50%", "50%"],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut",
          }}
        >
          <Bitcoin className="h-6 w-6 text-amber-400" />
        </motion.div>
      ))}

      <motion.div
        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 bg-green-100 px-3 py-1 rounded-full text-sm text-green-600 font-medium"
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: [-20, -40],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeOut",
        }}
      >
        + Match Perfeito!
      </motion.div>
    </div>
  );
};

const MatchingSection = () => {
  const matches = jobs?.map(job => ({
    job,
    score: calculateMatchScore(job, userSkills, userLocation, preferredWorkType)
  })).sort((a, b) => b.score - a.score).slice(0, 5);

  if (!matches?.length) return null;

  return (
    <Card className="border-blue-100 bg-blue-50/10 shadow-sm hover:shadow-md transition-shadow p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
          Matches em Tempo Real
        </h2>
        <p className="text-blue-400">
          Encontre as melhores oportunidades baseadas no seu perfil
        </p>
      </div>

      <div className="space-y-4">
        {matches.map(({ job, score }, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium text-gray-900">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.city}, {job.country}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Tipo:</span>
                  <span className="text-blue-600 capitalize">{job.workType}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {score}%
                </span>
                {score >= 80 && (
                  <span className="text-xs text-green-600 mt-1">Match Perfeito!</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

return (
  <div className="min-h-screen bg-white">
    <Tutorial />
    <MarqueeSponsors />
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="welcome-section mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            {t('home.welcome')}
          </h1>
          <p className="text-xl text-blue-400 mb-6">
            {t('home.subtitle')}
          </p>
          <MatchAnimation />
          <Button
            variant="secondary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={() => tutorial.startTutorial()}
          >
            {t('tutorial.start')}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <JobSwipe />
        </motion.div>

        <FloatingJobs />

        {user && (
          <>
            {user.userType === "professional" && <MatchingSection />}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <UserProgress />
            </motion.div>

            {user.userType === "professional" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <ProfessionalStats />
              </motion.div>
            )}
          </>
        )}

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
            className="jobs-section group relative overflow-hidden rounded-xl border border-blue-100 bg-white p-6 shadow-md transition-all hover:shadow-lg"
          >
            <Link href="/jobs">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-50 p-3">
                  <Building2 className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-900">{t('navigation.jobs')}</h2>
                  <p className="text-gray-600 mb-4">
                    {t('jobs.findOpportunities')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
                  >
                    {t('jobs.viewJobs')}
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
      </div>
    </div>
  </div>
);
}