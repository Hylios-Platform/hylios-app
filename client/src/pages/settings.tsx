import { useAuth } from "@/hooks/use-auth";
import { KycSettings } from "@/components/settings/kyc-settings";
import { WalletSettings } from "@/components/settings/wallet-settings";
import { CompanyCredits } from "@/components/settings/company-credits";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { JobHistory } from "@/components/settings/job-history";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">
            Configurações
          </h1>

          <div className="space-y-6">
            <ProfileSettings />
            {user?.userType === "professional" && (
              <>
                <KycSettings />
                <JobHistory />
              </>
            )}
            <WalletSettings />
            {user?.userType === "company" && <CompanyCredits />}
            <NotificationSettings />
          </div>
        </div>
      </div>
    </div>
  );
}