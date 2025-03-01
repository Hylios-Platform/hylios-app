import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
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
            <motion.div
              className="relative cursor-pointer group"
              initial={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300"
                animate={{
                  opacity: [0.5, 0.7, 0.5],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <h1 className="relative text-2xl font-bold px-4 py-1 rounded-lg">
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-violet-500 transition-all duration-300">
                  Hylios
                </span>
              </h1>
            </motion.div>
          </Link>
        </motion.div>

        {!isAuthPage && (
          <div className="flex items-center gap-2">
            <nav className="flex gap-2">
              <Link href="/jobs">
                <Button 
                  size="sm" 
                  variant="default" 
                  className="h-7 px-2 text-xs bg-blue-400 hover:bg-blue-500 text-white shadow-sm transition-all duration-200"
                >
                  {t('navigation.jobs')}
                </Button>
              </Link>
              <Link href="/post-job">
                <Button 
                  size="sm" 
                  variant="default" 
                  className="h-7 px-2 text-xs bg-blue-400 hover:bg-blue-500 text-white shadow-sm transition-all duration-200"
                >
                  {t('navigation.postJob')}
                </Button>
              </Link>
              <Link href="/payments">
                <Button 
                  size="sm" 
                  variant="default" 
                  className="h-7 px-2 text-xs bg-blue-400 hover:bg-blue-500 text-white shadow-sm transition-all duration-200"
                >
                  {t('navigation.payments')}
                </Button>
              </Link>
            </nav>

            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-blue-200 dark:border-slate-700">
              <ThemeToggle />
              <WalletButton />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {user?.username || 'Dev User'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                className="h-7 px-2 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-300 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <span className="mr-1">Sair</span>
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}