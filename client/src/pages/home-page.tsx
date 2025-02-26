import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bitcoin, Building2, UserCheck } from "lucide-react";
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