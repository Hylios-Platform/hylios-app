import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Briefcase, Users, BarChart2, HelpCircle, Info, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WalletButton } from "@/components/wallet-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();
  const [location] = useLocation();

  const isAuthPage = location === '/auth' || location === '/password-reset';

  return (
    <header className="bg-gradient-to-r from-blue-50 to-blue-100/30 border-b border-blue-100 dark:from-slate-900 dark:to-slate-800 dark:border-slate-800 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/">
            <h1 className="text-2xl font-bold px-4 py-1 rounded-lg">
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Hylios
              </span>
            </h1>
          </Link>
        </motion.div>

        {!isAuthPage && (
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-2 overflow-x-auto md:gap-3 scrollbar-hide">
              <Link href="/dashboard">
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-8 px-2 text-xs md:text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50/80 flex items-center gap-1"
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>

              <Link href="/jobs">
                <Button 
                  size="sm" 
                  variant="default" 
                  className="h-8 px-2 text-xs md:text-sm bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 text-white shadow-sm flex items-center gap-1"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Trabalhos</span>
                </Button>
              </Link>

              <Link href="/professionals">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 px-2 text-xs md:text-sm text-violet-500 hover:text-violet-600 hover:bg-violet-50/80 flex items-center gap-1"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Profissionais</span>
                </Button>
              </Link>

              <Link href="/post-job">
                <Button 
                  size="sm" 
                  variant="default" 
                  className="h-8 px-2 text-xs md:text-sm bg-gradient-to-r from-violet-500 via-violet-600 to-violet-500 hover:from-violet-600 hover:via-violet-700 hover:to-violet-600 text-white shadow-sm flex items-center gap-1"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Publicar</span>
                </Button>
              </Link>

              <Link href="/about">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 px-2 text-xs md:text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50/80 flex items-center gap-1"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Sobre</span>
                </Button>
              </Link>

              <Link href="/support">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 px-2 text-xs md:text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50/80 flex items-center gap-1"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Suporte</span>
                </Button>
              </Link>
            </nav>

            <div className="flex items-center gap-2 ml-2 pl-2 md:ml-3 md:pl-3 border-l border-blue-200 dark:border-slate-700">
              <ThemeToggle />
              <WalletButton />
              {user ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1 md:gap-2"
                >
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
                    {user?.username || 'Dev User'}
                  </span>
                  <Link href="/auth">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => logoutMutation.mutate()}
                      className="h-8 px-2 text-xs md:text-sm bg-gradient-to-r from-red-500 via-red-600 to-red-500 hover:from-red-600 hover:via-red-700 hover:to-red-600 text-white shadow-sm flex items-center gap-1"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span className="hidden md:inline ml-1">Sair</span>
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <Link href="/auth">
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 px-2 text-xs md:text-sm bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 text-white shadow-sm"
                  >
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}