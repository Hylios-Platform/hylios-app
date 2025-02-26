import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bitcoin, Building2, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tutorial, TutorialButton } from "@/components/onboarding/tutorial";

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user?.userType === "company") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t('home.welcome')}</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {t('home.subtitle')}
          </p>
          <Link href="/post-job">
            <Button size="lg" className="w-full md:w-auto">
              {t('navigation.postJob')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tutorial />
      <div className="max-w-2xl mx-auto">
        <div className="welcome-section mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('home.welcome')}</h1>
          <p className="text-lg text-muted-foreground mb-4">
            {t('home.subtitle')}
          </p>
          <TutorialButton />
        </div>

        <div className="grid gap-6">
          <div className="kyc-section flex items-start gap-4 p-4 border rounded-lg">
            <UserCheck className="h-6 w-6 text-green-500 mt-1" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Completar KYC</h2>
              <p className="text-muted-foreground mb-4">
                {t('jobs.completeKyc')}
              </p>
              <Button variant="outline">Iniciar Verificação</Button>
            </div>
          </div>

          <div className="jobs-section flex items-start gap-4 p-4 border rounded-lg">
            <Building2 className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h2 className="text-lg font-semibold mb-2">{t('navigation.jobs')}</h2>
              <p className="text-muted-foreground mb-4">
                Encontre oportunidades que correspondam às suas habilidades
              </p>
              <Link href="/jobs">
                <Button variant="outline">Ver Trabalhos</Button>
              </Link>
            </div>
          </div>

          <div className="payment-section flex items-start gap-4 p-4 border rounded-lg">
            <Bitcoin className="h-6 w-6 text-yellow-500 mt-1" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Receba em Bitcoin</h2>
              <p className="text-muted-foreground">
                Complete tarefas e receba pagamentos instantâneos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}