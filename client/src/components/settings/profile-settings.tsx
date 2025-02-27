import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Settings } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  fullName: z.string().min(3, "Nome completo precisa ter pelo menos 3 caracteres"),
  bio: z.string().max(500, "Bio não pode ter mais de 500 caracteres"),
  location: z.string().min(2, "Localização é obrigatória"),
  skills: z.string().optional()
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.profileData?.fullName || "",
      bio: user?.profileData?.bio || "",
      location: user?.profileData?.location || "",
      skills: user?.profileData?.skills || ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const res = await apiRequest("POST", "/api/profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          <CardTitle>Informações do Perfil</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <Input
                {...form.register("fullName")}
                placeholder="Seu nome completo"
              />
              {form.formState.errors.fullName && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Bio</label>
              <textarea
                {...form.register("bio")}
                className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Uma breve descrição sobre você"
              />
              {form.formState.errors.bio && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.bio.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Localização</label>
              <Input
                {...form.register("location")}
                placeholder="Sua cidade/estado"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Habilidades</label>
              <Input
                {...form.register("skills")}
                placeholder="Ex: JavaScript, React, Node.js"
              />
              {form.formState.errors.skills && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.skills.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={mutation.isPending}
            >
              Salvar Perfil
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
