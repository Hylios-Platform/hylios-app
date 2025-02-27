import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="bg-blue-50 border-b border-blue-100">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">
            <Link href="/">
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-violet-500 transition-colors cursor-pointer">
                Hylios
              </span>
            </Link>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <nav className="flex gap-2">
            <Link href="/jobs">
              <Button 
                size="sm" 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-2 h-8 shadow-sm"
              >
                {t('navigation.jobs')}
              </Button>
            </Link>
            <Link href="/post-job">
              <Button 
                size="sm" 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-2 h-8 shadow-sm"
              >
                {t('navigation.postJob')}
              </Button>
            </Link>
            <Link href="/payments">
              <Button 
                size="sm" 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-2 h-8 shadow-sm"
              >
                {t('navigation.payments')}
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2 ml-3 pl-3 border-l border-blue-200">
            <span className="text-sm text-gray-700">
              {user?.username || 'Dev User'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 flex items-center gap-1 px-2 h-8 transition-colors"
            >
              <span className="text-sm">Sair</span>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}