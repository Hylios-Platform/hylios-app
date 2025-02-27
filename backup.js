import fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar um arquivo de saída
const output = fs.createWriteStream('project-backup.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Nível máximo de compressão
});

// Ouvir eventos do archiver
output.on('close', () => {
  console.log(`Backup criado com sucesso! Tamanho: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
});

archive.on('error', (err) => {
  throw err;
});

// Arquivos e pastas para incluir no backup
const includes = [
  'client',
  'server',
  'shared',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'README.md',
  '.env.example',
  'theme.json',
  'tailwind.config.ts',
  'drizzle.config.ts'
];

// Arquivos e pastas para excluir
const excludes = [
  'node_modules',
  'dist',
  '.git',
  '*.log',
  'uploads/*'
];

// Pipe arquivo de saída
archive.pipe(output);

// Adicionar arquivos ao zip
includes.forEach(item => {
  const itemPath = path.join(__dirname, item);
  if (fs.existsSync(itemPath)) {
    if (fs.lstatSync(itemPath).isDirectory()) {
      archive.directory(itemPath, item);
    } else {
      archive.file(itemPath, { name: path.basename(item) });
    }
  }
});

// Finalizar o arquivo
archive.finalize();