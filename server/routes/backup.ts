import { Express } from "express";
import archiver from "archiver";
import path from "path";
import fs from "fs";

export function setupBackupRoutes(app: Express) {
  app.get("/api/backup/download", async (req, res) => {
    try {
      const archive = archiver("zip", {
        zlib: { level: 9 } // Nível máximo de compressão
      });

      // Nome do arquivo com data/hora
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `hylios-backup-${timestamp}.zip`;

      // Configurar headers para download
      res.attachment(filename);
      archive.pipe(res);

      // Adicionar diretórios principais ao zip
      const directories = ["client", "server", "shared"];
      directories.forEach(dir => {
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

      // Finalizar o arquivo
      await archive.finalize();

      console.log(`Backup criado com sucesso: ${filename}`);
    } catch (error) {
      console.error("Erro ao criar backup:", error);
      res.status(500).json({ error: "Erro ao gerar backup" });
    }
  });
}
