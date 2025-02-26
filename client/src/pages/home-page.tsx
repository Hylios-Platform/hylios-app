import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bitcoin, Building2, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tutorial, TutorialButton } from "@/components/onboarding/tutorial";
import { motion } from "framer-motion";

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

  if (user?.userType === "company") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {t('home.welcome')}
            </h1>
            <p className="text-xl text-slate-600 mb-10">
              {t('home.subtitle')}
            </p>
            <Link href="/post-job">
              <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg">
                {t('navigation.postJob')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
      <Tutorial />
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
            <p className="text-xl text-slate-600 mb-6">
              {t('home.subtitle')}
            </p>
            <TutorialButton />
          </motion.div>

          <motion.div 
            className="grid gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div 
              variants={item}
              className="kyc-section group relative overflow-hidden rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm p-6 shadow-lg transition-all hover:shadow-xl hover:bg-white/80"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-emerald-50 p-3">
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-slate-900">Completar KYC</h2>
                  <p className="text-slate-600 mb-4">
                    {t('jobs.completeKyc')}
                  </p>
                  <Button variant="outline" className="bg-white/80 backdrop-blur-sm hover:bg-white">
                    Iniciar Verificação
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="jobs-section group relative overflow-hidden rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm p-6 shadow-lg transition-all hover:shadow-xl hover:bg-white/80"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-50 p-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-slate-900">{t('navigation.jobs')}</h2>
                  <p className="text-slate-600 mb-4">
                    Encontre oportunidades que correspondam às suas habilidades
                  </p>
                  <Link href="/jobs">
                    <Button variant="outline" className="bg-white/80 backdrop-blur-sm hover:bg-white">
                      Ver Trabalhos
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="payment-section group relative overflow-hidden rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm p-6 shadow-lg transition-all hover:shadow-xl hover:bg-white/80"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-50 p-3">
                  <Bitcoin className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-slate-900">Receba em Bitcoin</h2>
                  <p className="text-slate-600">
                    Complete tarefas e receba pagamentos instantâneos
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