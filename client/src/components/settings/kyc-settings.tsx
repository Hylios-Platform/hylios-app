import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KycForm } from "@/components/kyc-form";
import { Shield, CheckCircle, XCircle } from "lucide-react";

export function KycSettings() {
  const { user } = useAuth();

  const statusIcons = {
    pending: <Shield className="h-5 w-5 text-yellow-500" />,
    verified: <CheckCircle className="h-5 w-5 text-green-500" />,
    rejected: <XCircle className="h-5 w-5 text-red-500" />
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {statusIcons[user?.kycStatus || "pending"]}
          <CardTitle>Verificação KYC</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {user?.kycStatus === "verified" ? (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-700">Sua verificação KYC foi aprovada.</p>
          </div>
        ) : (
          <KycForm />
        )}
      </CardContent>
    </Card>
  );
}
