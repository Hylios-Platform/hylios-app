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
      <div className="container mx-auto px-4 h-24 flex items-center">
        <Link href="/" className="mr-12">
          <span className="text-3xl font-bold text-white hover:text-sky-100 transition-colors cursor-pointer">
            Hylios
          </span>
        </Link>

        {!isAuthPage && (
          <>
            <div className="flex-1 flex items-center justify-center">
              <nav className="hidden md:flex items-center space-x-8">
                <WalletButton />
                <Link href="/post-job">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="h-14 px-10 text-base font-medium bg-white/40 hover:bg-white/50 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    {t('navigation.postJob')}
                  </Button>
                </Link>
                <Link href="/payments">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="h-14 px-10 text-base font-medium bg-white/40 hover:bg-white/50 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    {t('navigation.payments')}
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="h-14 px-10 text-base font-medium bg-white/40 hover:bg-white/50 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    {t('navigation.settings')}
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-6 ml-12 pl-12 border-l border-white/20 dark:border-slate-700">
              <ThemeToggle />
              <span className="text-base font-medium text-white">
                {user?.username || 'Dev User'}
              </span>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => logoutMutation.mutate()}
                className="h-10 px-4 text-base font-medium text-white hover:text-red-200 hover:bg-red-500/20 transition-all"
              >
                <span className="mr-2">Sair</span>
                <LogOut className="h-5 w-5" />
              </Button>
              <MobileNav />
            </div>
          </>
        )}
      </div>
    </header>
  );
}