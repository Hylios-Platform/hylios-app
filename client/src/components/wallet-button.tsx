import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const walletSchema = z.object({
  walletAddress: z.string().min(26, "Endereço de carteira inválido").max(35, "Endereço de carteira inválido")
});

type WalletFormData = z.infer<typeof walletSchema>;

export function WalletButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<WalletFormData>({
    resolver: zodResolver(walletSchema)
  });

  const mutation = useMutation({
    mutationFn: async (data: WalletFormData) => {
      const response = await apiRequest("POST", "/api/wallet", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Carteira atualizada",
        description: "Seu endereço de carteira foi atualizado com sucesso.",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar carteira",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WalletFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="h-4 w-4" />
          {t('wallet.myWallet')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('wallet.addWallet')}</DialogTitle>
          <DialogDescription>{t('wallet.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("walletAddress")}
              placeholder="Endereço da carteira Bitcoin"
              defaultValue={user?.walletAddress || ""}
            />
            {errors.walletAddress && (
              <p className="text-sm text-red-500 mt-1">{errors.walletAddress.message}</p>
            )}
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
