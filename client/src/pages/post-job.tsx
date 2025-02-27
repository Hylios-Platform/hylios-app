import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertJobSchema, type InsertJob, jobCategories, jobCategorySkills } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function PostJob() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<InsertJob>({
    resolver: zodResolver(insertJobSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      currency: "EUR",
      location: "",
      workType: "remote",
      requiredSkills: [],
      category: "other"
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertJob) => {
      const res = await apiRequest("POST", "/api/jobs", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: "Trabalho Publicado",
        description: "Seu trabalho foi publicado com sucesso"
      });
      setLocation("/jobs");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Função para adicionar habilidades sugeridas
  const addSuggestedSkills = (category: keyof typeof jobCategorySkills) => {
    const currentSkills = form.getValues("requiredSkills") || [];
    const suggestedSkills = jobCategorySkills[category];
    const newSkills = Array.from(new Set([...currentSkills, ...suggestedSkills]));
    form.setValue("requiredSkills", newSkills);
  };

  // Função para remover uma habilidade
  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("requiredSkills") || [];
    form.setValue(
      "requiredSkills",
      currentSkills.filter(skill => skill !== skillToRemove)
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Publicar Novo Trabalho
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Título do Trabalho</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ex: Análise de Dados em Excel" 
                        {...field}
                        className="border-blue-100 focus:border-blue-200 bg-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Descrição do Trabalho</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os requisitos e entregas do trabalho"
                        className="min-h-[120px] border-blue-100 focus:border-blue-200 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Valor</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="ex: 1000" 
                          {...field}
                          className="border-blue-100 focus:border-blue-200 bg-white" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Moeda</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-blue-100 focus:border-blue-200 bg-white">
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="AED">AED</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Localização</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ex: Dubai, UAE" 
                        {...field}
                        className="border-blue-100 focus:border-blue-200 bg-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Tipo de Trabalho</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-blue-100 focus:border-blue-200 bg-white">
                          <SelectValue placeholder="Selecione o tipo de trabalho" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="remote">Remoto</SelectItem>
                        <SelectItem value="onsite">Presencial</SelectItem>
                        <SelectItem value="hybrid">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Categoria Profissional</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        addSuggestedSkills(value as keyof typeof jobCategorySkills);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-blue-100 focus:border-blue-200 bg-white">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sales">Vendedor/Comercial</SelectItem>
                        <SelectItem value="reception">Recepcionista/Atendimento</SelectItem>
                        <SelectItem value="administrative">Auxiliar Administrativo/Digitador</SelectItem>
                        <SelectItem value="healthcare">Cuidador/Profissional de Saúde</SelectItem>
                        <SelectItem value="driver">Motorista/Entregador</SelectItem>
                        <SelectItem value="education">Professor/Instrutor</SelectItem>
                        <SelectItem value="restaurant">Garçom/Profissional de Restaurante</SelectItem>
                        <SelectItem value="production">Operador de Produção</SelectItem>
                        <SelectItem value="other">Outra categoria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requiredSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Habilidades Necessárias</FormLabel>
                    <div className="space-y-4">
                      <FormControl>
                        <Input 
                          placeholder="Digite uma habilidade e pressione Enter" 
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const value = e.currentTarget.value.trim();
                              if (value) {
                                const currentSkills = field.value || [];
                                if (!currentSkills.includes(value)) {
                                  field.onChange([...currentSkills, value]);
                                }
                                e.currentTarget.value = "";
                              }
                            }
                          }}
                          className="border-blue-100 focus:border-blue-200 bg-white" 
                        />
                      </FormControl>
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors"
                disabled={mutation.isPending}
              >
                Publicar Trabalho
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}