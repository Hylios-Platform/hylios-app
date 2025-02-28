import fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar um arquivo de saída
const output = fs.createWriteStream('hylios-project-backup.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Nível máximo de compressão
});

// Ouvir eventos do archiver
output.on('close', () => {
  console.log(`\nBackup do projeto Hylios criado com sucesso!`);
  console.log(`Tamanho do arquivo: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  console.log('\nPara restaurar o projeto:');
  console.log('1. Descompacte o arquivo hylios-project-backup.zip');
  console.log('2. Execute: npm install');
  console.log('3. Configure as variáveis de ambiente no arquivo .env');
  console.log('4. Execute: npm run dev');
});

archive.on('error', (err) => {
  throw err;
});

archive.on('entry', (entry) => {
  console.log(`Adicionando: ${entry.name}`);
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
  'drizzle.config.ts',
  'postcss.config.js',
  'index.html'
];

// Arquivos e pastas para excluir
const excludes = [
  'node_modules',
  'dist',
  '.git',
  '*.log',
  'uploads/*',
  '.env',
  '*.zip'
];

console.log('\nIniciando backup do projeto Hylios...');
console.log('Verificando e incluindo os seguintes arquivos:');
includes.forEach(item => console.log(`- ${item}`));

// Pipe arquivo de saída
archive.pipe(output);

// Adicionar arquivos ao zip
includes.forEach(item => {
  const itemPath = path.join(__dirname, item);
  if (fs.existsSync(itemPath)) {
    if (fs.lstatSync(itemPath).isDirectory()) {
      archive.directory(itemPath, item);
      console.log(`\nAdicionando diretório: ${item}`);
    } else {
      archive.file(itemPath, { name: path.basename(item) });
      console.log(`\nAdicionando arquivo: ${item}`);
    }
  } else {
    console.log(`\nAviso: ${item} não encontrado`);
  }
});

// Finalizar o arquivo
archive.finalize();