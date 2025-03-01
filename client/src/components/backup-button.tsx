import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function BackupButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch("/api/backup/download", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar backup");
      }

      // Criar um link temporário para download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = response.headers.get("content-disposition")?.split("filename=")[1] || "hylios-backup.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Backup criado com sucesso!",
        description: "O download do arquivo começará automaticamente.",
      });
    } catch (error) {
      console.error("Erro ao fazer download:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar backup",
        description: "Não foi possível criar o arquivo de backup. Tente novamente.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando backup...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download Backup
        </>
      )}
    </Button>
  );
}
