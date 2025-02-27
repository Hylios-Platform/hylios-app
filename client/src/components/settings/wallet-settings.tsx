import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet, Copy } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const walletSchema = z.object({
  walletAddress: z.string().min(26, "Endereço de carteira inválido")
});

type WalletForm = z.infer<typeof walletSchema>;

export function WalletSettings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<WalletForm>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      walletAddress: user?.walletAddress || ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: WalletForm) => {
      const res = await apiRequest("POST", "/api/wallet", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Carteira atualizada",
        description: "Seu endereço de carteira foi atualizado com sucesso."
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-500" />
          <CardTitle>Configuração de Carteira</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
          <div className="space-y-4">
            <div>
              <Input
                {...form.register("walletAddress")}
                placeholder="Endereço da carteira Bitcoin"
              />
              {form.formState.errors.walletAddress && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.walletAddress.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={mutation.isPending}
            >
              Salvar Carteira
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
