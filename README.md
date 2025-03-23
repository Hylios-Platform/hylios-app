# Hylios - Plataforma de Serviços Blockchain

Plataforma de contratação de serviços instantâneos com tecnologia blockchain, focada em simplificar a conexão entre empresas e profissionais.

## Tecnologias Utilizadas

- Frontend: React + Vite
- Estilização: TailwindCSS + shadcn/ui
- Backend: Express.js
- Autenticação: Passport.js
- Banco de Dados: PostgreSQL + Drizzle ORM
- Upload de Arquivos: Multer

## Pré-requisitos

- Node.js 18+ ou 20+
- PostgreSQL
- NPM ou Yarn

## Instalação

1. Clone o repositório:
```bash
git clone [seu-repositorio]
cd [seu-projeto]
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com:
```env
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/nome_do_banco
SESSION_SECRET=sua_chave_secreta
```

4. Execute as migrações do banco de dados:
```bash
npm run db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5000`

## Funcionalidades Principais

- 🔐 Autenticação de usuários (empresas e profissionais)
- 📝 Verificação KYC com upload de documentos
- 💼 Publicação e candidatura a vagas
- 💰 Sistema de pagamentos com criptomoedas
- 🌍 Suporte a múltiplos idiomas
- 🎯 Sistema de gamificação com pontos e conquistas

## Estrutura do Projeto

```
├── client/             # Frontend React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── hooks/     # Custom hooks
│   │   ├── lib/       # Utilitários
│   │   └── pages/     # Páginas da aplicação
├── server/            # Backend Express
│   ├── auth.ts       # Configuração de autenticação
│   ├── routes.ts     # Rotas da API
│   └── storage.ts    # Interface com banco de dados
└── shared/           # Código compartilhado
    └── schema.ts     # Schemas e tipos
```

## Produção

Para build de produção:

```bash
npm run build
```

Os arquivos de build estarão na pasta `dist/`.

## Backup e Restauração

Para fazer backup do projeto:

1. Use o script de backup fornecido:
```bash
npm run backup
```

2. O arquivo `project-backup.zip` será criado contendo todo o código fonte.

Para restaurar:

1. Descompacte o arquivo de backup
2. Siga as instruções de instalação acima

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Crie um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
