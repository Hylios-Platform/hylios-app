import { Express } from "express";
import archiver from "archiver";
import path from "path";
import fs from "fs";

export function setupBackupRoutes(app: Express) {
  app.get("/api/backup/download", async (req, res) => {
    try {
      // Criar um arquivo zip
      const archive = archiver("zip", {
        zlib: { level: 9 }
      });

      // Nome do arquivo
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `hylios-backup-${timestamp}.zip`;

      // Configurar headers
      res.attachment(fileName);
      archive.pipe(res);

      // Lista de diretórios para incluir no backup
      const dirsToBackup = ["client", "server", "shared"];

      // Adicionar diretórios ao arquivo zip
      dirsToBackup.forEach(dir => {
        archive.directory(dir, dir);
      });

      // Adicionar arquivos da raiz
      const rootFiles = [
        "package.json",
        "tsconfig.json",
        "vite.config.ts",
        "README.md",
        "theme.json"
      ];

      rootFiles.forEach(file => {
        if (fs.existsSync(file)) {
          archive.file(file, { name: file });
        }
      });

      console.log("Iniciando geração do backup...");
      await archive.finalize();
      console.log("Backup gerado com sucesso!");

    } catch (error) {
      console.error("Erro ao gerar backup:", error);
      res.status(500).json({ error: "Erro ao gerar backup" });
    }
  });
}
