import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  walletAddress: z
    .string()
    .min(26, "Endereço Bitcoin inválido - muito curto")
    .max(35, "Endereço Bitcoin inválido - muito longo")
    .regex(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, "Endereço Bitcoin inválido - formato incorreto")
});

type WalletFormData = z.infer<typeof walletSchema>;

export function WalletButton() {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<WalletFormData>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      walletAddress: user?.walletAddress || ""
    }
  });

  const currentWalletAddress = watch("walletAddress");

  const mutation = useMutation({
    mutationFn: async (data: WalletFormData) => {
      const response = await apiRequest("POST", "/api/wallet", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Carteira atualizada com sucesso",
        description: "Seu endereço Bitcoin foi salvo e será usado para receber pagamentos.",
        className: "bg-green-50 border-green-200",
      });
      setOpen(false);
      setShowConfirm(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar carteira",
        description: error.message,
        variant: "destructive",
      });
      setShowConfirm(false);
    },
  });

  const onSubmit = (data: WalletFormData) => {
    setShowConfirm(true);
  };

  const confirmSave = () => {
    mutation.mutate({ walletAddress: currentWalletAddress });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3 text-xs bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
        >
          <Wallet className="h-3 w-3 mr-1" />
          {t('wallet.myWallet')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-blue-700">
            {t('wallet.addWallet')}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {t('wallet.description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register("walletAddress")}
              placeholder="Endereço da carteira Bitcoin"
              className="border-blue-100 focus:border-blue-300 focus:ring-blue-200"
            />
            {errors.walletAddress && (
              <p className="text-xs text-red-500">{errors.walletAddress.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              size="sm"
              disabled={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {mutation.isPending ? "Salvando..." : "Confirmar endereço"}
            </Button>
          </DialogFooter>
        </form>

        {showConfirm && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-sm font-medium text-blue-700 mb-2">
              Confirme seu endereço Bitcoin
            </h4>
            <p className="text-xs text-blue-600 break-all mb-4">
              {currentWalletAddress}
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="text-xs h-8"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={confirmSave}
                className="text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
              >
                Confirmar e Salvar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}