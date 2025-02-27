import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kycSchema, type KycData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, ArrowRight, Check, User, FileText, MapPin } from "lucide-react";
import { useState } from "react";

export function KycForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<KycData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      documentType: "passport",
      documentNumber: "",
      address: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: KycData) => {
      const res = await apiRequest("POST", "/api/kyc", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "KYC Enviado",
        description: "Seus documentos foram enviados para verificação",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    const fields = step === 1 
      ? ["fullName", "dateOfBirth"]
      : step === 2 
      ? ["documentType", "documentNumber"]
      : ["address"];

    const stepValid = fields.every(field => form.getFieldState(field).isDirty);

    if (stepValid) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, preencha todos os campos antes de continuar",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="p-4">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold mb-4">
          Verificação KYC
        </DialogTitle>
      </DialogHeader>

      <Tabs value={`step-${step}`} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="step-1" 
            onClick={() => setStep(1)}
            disabled={step < 1}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Pessoal
          </TabsTrigger>
          <TabsTrigger 
            value="step-2" 
            onClick={() => setStep(2)}
            disabled={step < 2}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger 
            value="step-3" 
            onClick={() => setStep(3)}
            disabled={step < 3}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Endereço
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4 mt-6"
          >
            <TabsContent value="step-1" className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="João da Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="step-2" className="space-y-4">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="passport">Passaporte</SelectItem>
                        <SelectItem value="id_card">RG</SelectItem>
                        <SelectItem value="drivers_license">CNH</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Documento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="step-3" className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Residencial</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              {step < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {mutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Finalizar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}