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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t('home.welcome')}
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              {t('home.subtitle')}
            </p>
            <Link href="/post-job">
              <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90">
                {t('navigation.postJob')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Tutorial />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="welcome-section mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t('home.welcome')}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
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
              className="kyc-section group relative overflow-hidden rounded-xl border bg-gradient-to-b from-background to-primary/5 p-6 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">Completar KYC</h2>
                  <p className="text-muted-foreground mb-4">
                    {t('jobs.completeKyc')}
                  </p>
                  <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                    Iniciar Verificação
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="jobs-section group relative overflow-hidden rounded-xl border bg-gradient-to-b from-background to-primary/5 p-6 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">{t('navigation.jobs')}</h2>
                  <p className="text-muted-foreground mb-4">
                    Encontre oportunidades que correspondam às suas habilidades
                  </p>
                  <Link href="/jobs">
                    <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                      Ver Trabalhos
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="payment-section group relative overflow-hidden rounded-xl border bg-gradient-to-b from-background to-primary/5 p-6 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-yellow-100 p-3">
                  <Bitcoin className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">Receba em Bitcoin</h2>
                  <p className="text-muted-foreground">
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