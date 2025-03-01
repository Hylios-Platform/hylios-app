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

// Adiciona novos tipos para testimonials
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
  avatar: string;
}

// Mock data para testimonials
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "João Silva",
    role: "Desenvolvedor Full Stack",
    company: "TechCorp",
    message: "Encontrei as melhores oportunidades através da Hylios. O processo de pagamento em crypto é muito seguro!",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao"
  },
  {
    id: 2,
    name: "Maria Santos",
    role: "UX Designer",
    company: "DesignStudio",
    message: "A verificação KYC me deu muita confiança para trabalhar com clientes internacionais.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria123" 
  },
  {
    id: 3,
    name: "Pedro Costa",
    role: "DevOps Engineer",
    company: "CloudTech",
    message: "O sistema de matching é incrivelmente preciso! Todas as vagas são relevantes para meu perfil.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro456" 
  }
];

// Componente para Featured Jobs
const FeaturedJobs = () => {
  return (
    <div className="mt-12 bg-gradient-to-b from-blue-50/50 to-transparent p-8 rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
        Vagas em Destaque
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((job) => (
          <motion.div
            key={job}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: job * 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Desenvolvedor Senior</h3>
                <p className="text-sm text-gray-600">TechCorp • Remoto</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-500 mb-4">
              <Star className="h-4 w-4 fill-amber-500" />
              <span className="text-sm font-medium">Vaga Premium</span>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                Desenvolvimento de soluções inovadoras usando tecnologias modernas.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                  React
                </span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                  Node.js
                </span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                  AWS
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600">€5,000-€7,000</span>
              <Button size="sm" variant="outline" className="text-xs">
                Ver Detalhes
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Componente para Testimonials
const Testimonials = () => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
        O que dizem nossos profissionais
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full bg-blue-50"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-gray-600 text-sm italic">"{testimonial.message}"</p>
            <p className="text-sm text-blue-500 mt-4">{testimonial.company}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Componente para News Banner
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

const CompanyStats = () => {
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

const CompanyFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: 'Segurança Blockchain',
      description: 'Transações seguras e transparentes com tecnologia blockchain'
    },
    {
      icon: Rocket,
      title: 'Matchmaking Inteligente',
      description: 'Sistema avançado de correspondência baseado em IA'
    },
    {
      icon: Bitcoin,
      title: 'Pagamentos Crypto',
      description: 'Suporte a pagamentos em diversas criptomoedas'
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
            className="group p-6 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors"
              >
                <Icon className="h-6 w-6 text-blue-500" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
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

const MatchAnimation = () => (
  <div className="relative h-32 overflow-hidden my-4">
    <motion.div
      className="absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600"
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
        x: ["0%", "15%", "0%"],
        scale: [1, 1.1, 1],
        rotate: [0, 3, -3, 0]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute left-[10%] top-1/2 -translate-y-1/2"
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
        <Bitcoin className="h-8 w-8 text-green-400" />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-green-200/50 rounded-full blur-xl"
        />
        <motion.span
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium text-green-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-10, -20]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          +0.15 BTC
        </motion.span>
      </div>
    </motion.div>

    <motion.div
      animate={{
        x: ["0%", "-15%", "0%"],
        scale: [1, 1.1, 1],
        rotate: [0, -3, 3, 0]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute right-[10%] top-1/2 -translate-y-1/2"
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

const Features = () => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="kyc-section group relative overflow-hidden rounded-xl border border-blue-100 bg-white p-6 shadow-md transition-all hover:shadow-lg"
      >
        <Link href="/kyc-verification">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-emerald-50 p-3">
              <UserCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900">{t('jobs.startVerification')}</h2>
              <p className="text-gray-600 mb-4">{t('jobs.completeKyc')}</p>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="payment-section group relative overflow-hidden rounded-xl border border-blue-100 bg-white p-6 shadow-md transition-all hover:shadow-lg"
      >
        <Link href="/payments">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-amber-50 p-3">
              <Bitcoin className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900">{t('jobs.receivePayments')}</h2>
              <p className="text-gray-600">{t('jobs.receivePayments')}</p>
            </div>
          </div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="opportunities-section group relative overflow-hidden rounded-xl border border-blue-100 bg-white p-6 shadow-md transition-all hover:shadow-lg"
      >
        <Link href="/jobs">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-50 p-3">
              <Sparkles className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900">{t('jobs.findOpportunities')}</h2>
              <p className="text-gray-600 mb-4">{t('jobs.findOpportunities')}</p>
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
        {/* News Banner */}
        <NewsBanner />

        <div className="max-w-2xl mx-auto">
          <motion.div
            className="welcome-section text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Logo animation */}
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

          <CompanyStats />
          <CompanyFeatures />

          {/* Featured Jobs Section */}
          <FeaturedJobs />

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

          {/* Job Swipe Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 mb-12"
          >
            <JobSwipe />
          </motion.div>

          {/* Testimonials Section */}
          <Testimonials />

          {user && <Features />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;