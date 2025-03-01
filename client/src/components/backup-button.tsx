import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function BackupButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/backup/download");
      
      if (!response.ok) {
        throw new Error("Erro ao gerar backup");
      }

      // Criar um blob a partir da resposta
      const blob = await response.blob();
      
      // Criar URL para download
      const url = window.URL.createObjectURL(blob);
      
      // Criar elemento de link temporário
      const link = document.createElement("a");
      link.href = url;
      link.download = response.headers.get("content-disposition")?.split("filename=")[1] || "hylios-backup.zip";
      
      // Simular clique para iniciar download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL
      window.URL.revokeObjectURL(url);

      toast({
        title: "Backup concluído",
        description: "O download do backup foi iniciado com sucesso.",
      });
    } catch (error) {
      console.error("Erro:", error);
      toast({
        variant: "destructive",
        title: "Erro no backup",
        description: "Não foi possível gerar o backup. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBackup}
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando backup...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Fazer download do backup
        </>
      )}
    </Button>
  );
}
