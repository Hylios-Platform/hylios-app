import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp } from "lucide-react";

export function CompanyCredits() {
  const { user } = useAuth();

  if (user?.userType !== "company") return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-violet-500" />
          <CardTitle>Créditos Disponíveis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Saldo Atual</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(parseFloat(user.companyCredits || "0"))}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-violet-400" />
          </div>
          <div className="text-sm text-gray-600">
            <p>Use seus créditos para publicar vagas e contratar profissionais.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
