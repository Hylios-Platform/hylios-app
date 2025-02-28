import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const professionalSchema = z.object({
  username: z.string()
    .min(3, "auth.errors.usernameMin")
    .max(50, "auth.errors.usernameMax"),
  email: z.string()
    .email("auth.errors.invalidEmail"),
  password: z.string()
    .min(6, "auth.errors.passwordMin")
    .max(50, "auth.errors.passwordMax"),
  fullName: z.string()
    .min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  skills: z.string()
    .min(1, "Informe pelo menos uma habilidade"),
  portfolio: z.string()
    .url("URL do portfólio inválida")
    .optional(),
  bio: z.string()
    .max(500, "Biografia deve ter no máximo 500 caracteres")
});

type ProfessionalFormData = z.infer<typeof professionalSchema>;

export default function ProfessionalSignup() {
  const { t } = useTranslation();
  const { registerMutation } = useAuth();
  const [step, setStep] = useState(1);

  const form = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      skills: "",
      portfolio: "",
      bio: ""
    }
  });

  const onSubmit = async (data: ProfessionalFormData) => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    try {
      await registerMutation.mutateAsync({
        ...data,
        type: "professional"
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-blue-100 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
                {t('auth.professional')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {step === 1 ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.username')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.email')}</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.password')}</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Habilidades</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Ex: React, Node.js, TypeScript" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="portfolio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Portfólio (opcional)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="url" 
                                placeholder="https://seu-portfolio.com" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biografia</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Uma breve descrição sobre você" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      disabled={registerMutation.isPending}
                    >
                      {step === 1 ? "Próximo" : registerMutation.isPending ? "Cadastrando..." : "Finalizar Cadastro"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
