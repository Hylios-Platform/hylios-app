import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Wallet, DollarSign, History, ArrowUpDown, Bitcoin } from "lucide-react";
import { motion } from "framer-motion";

export default function Payments() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {t("payments.title")}
            </h1>

            <div className="grid gap-6">
              <Card className="border-blue-100 bg-blue-50/10 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bitcoin className="h-5 w-5 text-amber-400" />
                    <CardTitle>{t("payments.balance")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                    {user?.walletBalance || "0"} BTC
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ≈ ${(parseFloat(user?.walletBalance || "0") * 50000).toFixed(2)} USD
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 bg-blue-50/10 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5 text-blue-500" />
                    <CardTitle>{t("payments.pending")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                      <div>
                        <p className="font-medium text-gray-900">Trabalho #123</p>
                        <p className="text-sm text-gray-600">Pagamento pendente</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        0.05 BTC
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100 bg-blue-50/10 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-green-500" />
                    <CardTitle>{t("payments.history")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                      <div>
                        <p className="font-medium text-gray-900">Trabalho #122</p>
                        <p className="text-sm text-gray-600">Concluído em 25/02/2025</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        0.1 BTC
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}