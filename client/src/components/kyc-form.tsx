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
import { 
  Loader2, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  FileText, 
  MapPin, 
  Upload, 
  Camera,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function KycForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({
    document: null,
    selfie: null,
    proofOfAddress: null
  });
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({
    document: 0,
    selfie: 0,
    proofOfAddress: 0
  });

  const form = useForm<KycData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      documentType: "passport",
      documentNumber: "",
      nationality: "",
      phoneNumber: "",
      address: "",
      city: "",
      country: "",
      postalCode: ""
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: KycData) => {
      try {
        const formData = new FormData();

        // Adicionar campos do formulário
        Object.entries(data).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });

        // Adicionar arquivos
        Object.entries(uploadedFiles).forEach(([key, file]) => {
          if (file) {
            formData.append(key, file);

            // Atualizar progresso do upload
            setUploadProgress(prev => ({
              ...prev,
              [key]: 0
            }));
          }
        });

        const res = await apiRequest("POST", "/api/kyc", formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              Object.keys(uploadedFiles).forEach(key => {
                if (uploadedFiles[key]) {
                  setUploadProgress(prev => ({
                    ...prev,
                    [key]: progress
                  }));
                }
              });
            }
          }
        });

        const responseData = await res.json();
        return responseData;
      } catch (error) {
        console.error('Erro no upload:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "KYC Enviado",
        description: "Seus documentos foram enviados para verificação",
      });

      // Resetar progresso
      setUploadProgress({
        document: 0,
        selfie: 0,
        proofOfAddress: 0
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });

      // Resetar progresso em caso de erro
      setUploadProgress({
        document: 0,
        selfie: 0,
        proofOfAddress: 0
      });
    },
  });

  const handleFileUpload = (type: string, file: File) => {
    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validar tipo de arquivo
    const allowedTypes = {
      document: ['application/pdf', 'image/jpeg', 'image/png'],
      selfie: ['image/jpeg', 'image/png'],
      proofOfAddress: ['application/pdf', 'image/jpeg', 'image/png']
    };

    if (!allowedTypes[type as keyof typeof allowedTypes].includes(file.type)) {
      toast({
        title: "Erro",
        description: "Tipo de arquivo não permitido",
        variant: "destructive",
      });
      return;
    }

    setUploadedFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const nextStep = () => {
    const fields = step === 1
      ? ["fullName", "dateOfBirth", "nationality", "phoneNumber"]
      : step === 2
        ? ["documentType", "documentNumber"]
        : ["address", "city", "country", "postalCode"];

    const stepValid = fields.every(field => {
      const state = form.getFieldState(field as keyof KycData);
      return state.isDirty && !state.error;
    });

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

  const tabVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 }
    }
  };

  const helpMessages = {
    document: {
      title: "Documento de Identificação",
      description: "Envie uma foto clara do seu documento oficial (RG, CNH ou Passaporte). Certifique-se que todas as informações estão legíveis."
    },
    selfie: {
      title: "Foto do Rosto (Selfie)",
      description: "Tire uma selfie bem iluminada, olhando diretamente para a câmera. Evite usar óculos escuros ou chapéu."
    },
    proofOfAddress: {
      title: "Comprovante de Residência",
      description: "Aceitos: conta de luz, água, gás ou telefone fixo (até 3 meses). O documento deve estar em seu nome."
    }
  };

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User className="h-6 w-6 text-blue-500" />
          Verificação KYC
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4">
                <p className="text-sm">
                  A verificação KYC (Know Your Customer) é um processo necessário para garantir 
                  a segurança e conformidade da plataforma. Seus dados serão tratados com sigilo 
                  e segurança.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTitle>
      </DialogHeader>

      <Tabs value={`step-${step}`} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 gap-4 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="step-1"
            onClick={() => setStep(1)}
            disabled={step < 1}
            className="flex items-center gap-2 data-[state=active]:bg-blue-100/80 data-[state=active]:text-blue-700 transition-all duration-200"
          >
            <User className="h-4 w-4" />
            Dados Pessoais
            {step > 1 && <Check className="h-4 w-4 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger
            value="step-2"
            onClick={() => setStep(2)}
            disabled={step < 2}
            className="flex items-center gap-2 data-[state=active]:bg-blue-100/80 data-[state=active]:text-blue-700 transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            Documentos
            {step > 2 && <Check className="h-4 w-4 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger
            value="step-3"
            onClick={() => setStep(3)}
            disabled={step < 3}
            className="flex items-center gap-2 data-[state=active]:bg-blue-100/80 data-[state=active]:text-blue-700 transition-all duration-200"
          >
            <MapPin className="h-4 w-4" />
            Endereço
            {step > 3 && <Check className="h-4 w-4 text-green-500" />}
          </TabsTrigger>
        </TabsList>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-6"
          >
            <motion.div
              key={`step-${step}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabVariants}
            >
              <TabsContent value="step-1" className="space-y-4 mt-4">
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

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nacionalidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Brasileira" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="+55 (11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="step-2" className="space-y-4 mt-4">
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

                <div className="space-y-4">
                  {Object.entries(uploadedFiles).map(([type, file]) => (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-2 border-dashed border-gray-200 hover:border-blue-200 rounded-lg p-6 text-center transition-colors duration-200"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {type === 'document' && <FileText className="h-8 w-8 text-blue-400" />}
                        {type === 'selfie' && <Camera className="h-8 w-8 text-blue-400" />}
                        {type === 'proofOfAddress' && <Upload className="h-8 w-8 text-blue-400" />}

                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-700">
                            {helpMessages[type as keyof typeof helpMessages].title}
                          </p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs p-3">
                                <p className="text-sm">
                                  {helpMessages[type as keyof typeof helpMessages].description}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {file ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-gray-600 space-y-2"
                          >
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              {file.name}
                            </div>
                            {uploadProgress[type] > 0 && (
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <motion.div 
                                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress[type]}%` }}
                                  initial={{ width: "0%" }}
                                  animate={{ width: `${uploadProgress[type]}%` }}
                                />
                              </div>
                            )}
                          </motion.div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Arraste um arquivo ou clique para selecionar
                          </p>
                        )}

                        <Input 
                          type="file" 
                          className="hidden" 
                          id={`${type}Upload`}
                          accept={type === 'selfie' ? "image/*" : "image/*,.pdf"}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(type, file);
                          }}
                        />
                        <label htmlFor={`${type}Upload`}>
                          <Button
                            type="button"
                            variant={file ? "outline" : "default"}
                            size="sm"
                            className={`transition-all duration-200 ${
                              file
                                ? "hover:bg-blue-50 text-blue-600 border-blue-200"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {file ? 'Trocar Arquivo' : 'Selecionar Arquivo'}
                          </Button>
                        </label>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="step-3" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, Número, Complemento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </motion.div>

            <motion.div
              className="flex justify-between pt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="transition-transform hover:scale-105"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="transition-transform hover:scale-105 bg-blue-500 hover:bg-blue-600"
                >
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-green-600 hover:bg-green-700 transition-transform hover:scale-105"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Finalizar
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}