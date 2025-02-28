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
    <header className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 border-b border-blue-100 dark:from-slate-900 dark:to-slate-800 dark:border-slate-800">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Link href="/">
            <span className="text-xl font-bold text-white hover:text-sky-100 transition-colors cursor-pointer mr-2">
              Hylios
            </span>
          </Link>

          {!isAuthPage && (
            <nav className="hidden md:flex items-center space-x-1">
              <WalletButton />
              <Link href="/post-job">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-7 px-2 text-xs bg-white/10 hover:bg-white/20 text-white"
                >
                  {t('navigation.postJob')}
                </Button>
              </Link>
              <Link href="/jobs">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-7 px-2 text-xs bg-white/10 hover:bg-white/20 text-white"
                >
                  {t('navigation.jobs')}
                </Button>
              </Link>
              <Link href="/payments">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-7 px-2 text-xs bg-white/10 hover:bg-white/20 text-white"
                >
                  {t('navigation.payments')}
                </Button>
              </Link>
              <Link href="/pitch">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-7 px-2 text-xs bg-white/10 hover:bg-white/20 text-white"
                >
                  {t('navigation.pitch')}
                </Button>
              </Link>
              <Link href="/settings">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-7 px-2 text-xs bg-white/10 hover:bg-white/20 text-white"
                >
                  {t('navigation.settings')}
                </Button>
              </Link>
            </nav>
          )}
        </div>

        {!isAuthPage && (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-xs text-white">
              {user?.username || 'Dev User'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="h-7 px-2 text-xs text-white hover:text-red-200 hover:bg-red-500/20"
            >
              <span className="mr-1">Sair</span>
              <LogOut className="h-3 w-3" />
            </Button>
            <MobileNav />
          </div>
        )}
      </div>
    </header>
  );
}