import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KycForm } from "@/components/kyc-form";
import { Shield, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
          {statusIcons[user?.kycStatus as keyof typeof statusIcons]}
          <CardTitle>Verificação KYC</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {user?.kycStatus === "verified" ? (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-700">Sua verificação KYC foi aprovada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Complete sua verificação KYC para acessar todos os recursos da plataforma.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  Iniciar Verificação KYC
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-white">
                <KycForm />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}