import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserCheck, FileText, Camera, Upload } from "lucide-react";
import { KycForm } from "@/components/kyc-form";

export default function KycVerification() {
  const { user } = useAuth();

  const steps = [
    {
      icon: FileText,
      title: "Documentos Pessoais",
      description: "Upload do seu documento de identificação"
    },
    {
      icon: Camera,
      title: "Foto do Rosto",
      description: "Tire uma selfie para confirmar sua identidade"
    },
    {
      icon: Upload,
      title: "Comprovante de Residência",
      description: "Upload de um comprovante recente"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
              Verificação de Identidade
            </h1>
            <p className="text-blue-400">
              Complete a verificação para começar a trabalhar
            </p>
          </div>

          <Card className="border-blue-100 bg-blue-50/10 shadow-sm p-6 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-full bg-emerald-50 p-3">
                <UserCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Status da Verificação</h2>
                <p className="text-gray-600">
                  {user?.kycStatus === "verified" ? (
                    "Sua conta está verificada!"
                  ) : user?.kycStatus === "pending" ? (
                    "Verificação em análise"
                  ) : (
                    "Pendente de verificação"
                  )}
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white rounded-lg border border-blue-100"
                  >
                    <div className="rounded-full bg-blue-50 p-3">
                      <Icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          <KycForm />
        </motion.div>
      </div>
    </div>
  );
}
