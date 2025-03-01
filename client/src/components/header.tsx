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
            <h1 className="text-2xl font-bold px-4 py-1 rounded-lg">
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Hylios
              </span>
            </h1>
          </Link>
        </motion.div>

        {!isAuthPage && (
          <div className="flex items-center gap-2">
            <nav className="flex gap-2">
              <Link href="/jobs">
                <Button 
                  size="sm" 
                  variant="default" 
                  className="h-9 px-4 text-sm bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                >
                  Trabalhos
                </Button>
              </Link>
              <Link href="/post-job">
                <Button 
                  size="sm" 
                  variant="default" 
                  className="h-9 px-4 text-sm bg-violet-500 hover:bg-violet-600 text-white shadow-md"
                >
                  Publicar Trabalho
                </Button>
              </Link>
            </nav>

            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-blue-200 dark:border-slate-700">
              <ThemeToggle />
              <WalletButton />
              {user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.username || 'Dev User'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logoutMutation.mutate()}
                    className="h-9 px-3 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-300 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <span className="mr-1">Sair</span>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}