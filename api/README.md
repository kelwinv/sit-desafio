# Tasks API

API para gerenciamento de tarefas com autenticação JWT desenvolvida com NestJS.

## 📋 Sobre o Projeto

Esta API RESTful permite que usuários criem, leiam, atualizem e excluam tarefas pessoais. Cada usuário tem acesso apenas às suas próprias tarefas, garantindo isolamento e segurança dos dados através de autenticação JWT.

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js para construção de aplicações server-side
- **Prisma** - ORM para Node.js e TypeScript
- **MySql** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash de senhas
- **Docker** - Containerização do banco de dados
- **Swagger** - Documentação da API
- **Jest** - Framework de testes

## 📦 Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login com email e senha
- ✅ Autenticação JWT

### Gerenciamento de Tarefas
- ✅ Criar novas tarefas
- ✅ Listar todas as tarefas do usuário
- ✅ Filtrar tarefas por status
- ✅ Buscar tarefa específica por ID
- ✅ Atualizar tarefas existentes
- ✅ Excluir tarefas

### Status das Tarefas
- `pending` - Pendente
- `in-progress` - Em progresso
- `completed` - Concluída

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (v18 ou superior)
- Docker e Docker Compose
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**
```bash
git clone git@github.com:kelwinv/sit-desafio.git
cd api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Para facilitar os arquivos .env.development e .env.test já estão no projeto

4. GiftWise API

Este comando:
* Sobe os containers do banco de dados com Docker Compose
* Roda o script de inicialização com Prisma
* Inicia a aplicação com `--watch`

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3333`

## 📚 Documentação da API

### Swagger UI
A documentação interativa da API está disponível em:
```
http://localhost:3333/api
```

### Endpoints Principais

#### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login

#### Tarefas
- `POST /tasks` - Criar nova tarefa
- `GET /tasks` - Listar todas as tarefas
- `GET /tasks?status=pending` - Filtrar tarefas por status
- `GET /tasks/:id` - Buscar tarefa por ID
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Excluir tarefa

#### Outros
- `GET /health` - Verificar saúde da API

### Exemplos de Uso

#### Registro de usuário
```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

#### Criar tarefa
```bash
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -d '{
    "title": "Implementar autenticação JWT",
    "description": "Adicionar sistema de autenticação com JWT ao projeto",
    "status": "pending"
  }'
```

## 🧪 Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com coverage
```bash
npm run test:cov
```

## 🗄️ Banco de Dados

### Comandos úteis do Prisma

```bash
# Gerar client do Prisma
npm run prisma:generate

# Abrir Prisma Studio
npm run prisma:studio

# Criar nova migração
npm run prisma:migrate:dev

# Reset do banco de dados
npm run prisma:reset:dev
```

### Gerenciar serviços Docker

```bash
# Iniciar serviços
npm run services:up

# Parar serviços
npm run services:stop

# Remover serviços
npm run services:down
```

## 🚀 Deploy

### Produção
```bash
# Build da aplicação
npm run build

# Executar em produção
npm run start:prod
```

## 🔒 Segurança

- Senhas são criptografadas usando bcrypt
- Autenticação baseada em JWT
- Validação de dados de entrada
- Isolamento de dados por usuário
- Validação de UUID para parâmetros de rota

## 📁 Estrutura do Projeto

```
Api
├── eslint.config.mjs
├── infra
│   ├── db
│   │   └── compose.yml
│   ├── prisma
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── scripts
├── nest-cli.json
├── package.json
├── README.md
├── src
│   ├── app.module.ts
│   ├── auth
│   ├── config
│   ├── health
│   ├── main.ts
│   ├── prisma
│   ├── tasks
│   └── users
├── swagger.json
├── test
│   ├── integration
│   ├── types
│   └── utils
├── tsconfig.build.json
└── tsconfig.json
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia a aplicação |
| `npm run start:dev` | Inicia em modo desenvolvimento |
| `npm run start:debug` | Inicia em modo debug |
| `npm run build` | Build da aplicação |
| `npm test` | Executa os testes |
| `npm run lint:prettier:fix` | Corrige formatação |
| `npm run lint:eslint:fix` | Corrige problemas do ESLint |