import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./language-selector";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Hylios
            </a>
          </Link>
          <nav className="flex gap-4">
            <Link href="/jobs">
              <a className="text-foreground/80 hover:text-foreground">
                {t('navigation.jobs')}
              </a>
            </Link>
            {user.userType === "company" && (
              <Link href="/post-job">
                <a className="text-foreground/80 hover:text-foreground">
                  {t('navigation.postJob')}
                </a>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <span className="text-sm text-foreground/80">
            {user.userType === "company" ? user.companyName : user.username}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}