import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "wouter";
import { Job } from "@shared/schema";

export default function ApplicationStatus() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");

  // Simular mudança de status após alguns segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("approved");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/jobs">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para vagas
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center mb-4">
              Status da Candidatura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Indicador de Status */}
              <motion.div
                className="flex items-center justify-center"
                animate={{
                  scale: status === "pending" ? [1, 1.05, 1] : 1
                }}
                transition={{
                  duration: 1,
                  repeat: status === "pending" ? Infinity : 0
                }}
              >
                {status === "pending" ? (
                  <div className="bg-blue-50 p-4 rounded-full">
                    <Clock className="h-12 w-12 text-blue-500" />
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-full">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                )}
              </motion.div>

              {/* Mensagem de Status */}
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {status === "pending" ? "Candidatura em Análise" : "Candidatura Aprovada!"}
                </h3>
                <p className="text-gray-600">
                  {status === "pending"
                    ? "Suas informações foram enviadas para a empresa. Aguarde o retorno."
                    : "Parabéns! A empresa aprovou sua candidatura. Em breve entraremos em contato."}
                </p>
              </div>

              {/* Barra de Progresso */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-50">
                      Progresso
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {status === "pending" ? "50%" : "100%"}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-blue-50">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: status === "pending" ? "50%" : "100%" }}
                    transition={{ duration: 0.8 }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-400 to-blue-500"
                  />
                </div>
              </div>

              {/* Próximos Passos */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold mb-3">Próximos Passos:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Envio da candidatura
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Análise do perfil
                  </li>
                  <li className="flex items-center text-sm opacity-50">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    Entrevista inicial
                  </li>
                  <li className="flex items-center text-sm opacity-50">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    Proposta e contratação
                  </li>
                </ul>
              </div>

              {status === "approved" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <Button className="bg-green-500 hover:bg-green-600">
                    Iniciar Onboarding
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
