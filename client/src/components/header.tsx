import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <header className="bg-blue-50 border-b border-blue-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-900">
            <Link href="/">Hylios</Link>
          </h1>
          <nav className="flex gap-4">
            <Link href="/jobs">
              <span className="text-gray-700 hover:text-gray-900 cursor-pointer">
                {t('navigation.jobs')}
              </span>
            </Link>
            {user.userType === "company" && (
              <Link href="/post-job">
                <span className="text-gray-700 hover:text-gray-900 cursor-pointer">
                  {t('navigation.postJob')}
                </span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            {user.username}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logoutMutation.mutate()}
            className="text-gray-700 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}