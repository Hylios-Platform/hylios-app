import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WalletButton } from "@/components/wallet-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();
  const [location] = useLocation();

  const isAuthPage = location === '/auth' || location === '/password-reset';

  return (
    <header className="bg-blue-50 border-b border-blue-100 dark:from-slate-900 dark:to-slate-800 dark:border-slate-800 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">
            <Link href="/">
              <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer">
                Hylios
              </span>
            </Link>
          </h1>
        </div>

        {!isAuthPage && (
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex gap-2">
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
            <MobileNav />
          </div>
        )}
      </div>
    </header>
  );
}