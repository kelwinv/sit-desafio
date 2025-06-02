![Capa da Aplicação](./cover.png)

Este projeto foi desenvolvido como parte de um desafio técnico proposto pela [SIT](https://www.sittrade.com.br).

# Tasks App Fullstack

Bem-vindo ao repositório **Tasks App**, uma aplicação completa para gerenciamento de tarefas com frontend em Next.js e backend em NestJS. Este README reúne todas as informações de configuração, tecnologias e estrutura de ambos os projetos (front e API), além de exibir uma capa com a imagem da aplicação.

## 📋 Índice

1. [Tecnologias Utilizadas](#-tecnologias-utilizadas)

   * [Frontend](#frontend)
   * [Backend](#backend)
2. [Pré-requisitos](#-pr%C3%A9-requisitos)
3. [Instalação e Configuração](#-instala%C3%A7%C3%A3o-e-configura%C3%A7%C3%A3o)

   * [Clonar o Repositório](#clonar-o-reposit%C3%B3rio)
   * [Frontend](#frontend-1)
   * [Backend](#backend-1)
4. [Estrutura de Pastas](#-estrutura-de-pastas)
5. [Frontend: Páginas e Rotas](#frontend-p%C3%A1ginas-e-rotas)
6. [Backend: Endpoints Principais](#backend-endpoints-principais)
7. [Scripts Disponíveis](#-scripts-dispon%C3%ADveis)
8. [Documentação](#-documenta%C3%A7%C3%A3o)
9. [Licença](#-licen%C3%A7a)

---

## 🚀 Tecnologias Utilizadas

### Frontend

* **Next.js 15**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui** (biblioteca de componentes)
* **React Context** (gerenciamento de estado de autenticação)
* **Sonner** (notificações toast)
* **Lucide React** (ícones)

### Backend (API)

* **NestJS**
* **Prisma**
* **MySQL** (via Docker)
* **JWT** (autenticação)
* **bcrypt** (hash de senhas)
* **Docker & Docker Compose**
* **Swagger** (documentação)
* **Jest** (testes)

---

## 🛠️ Pré-requisitos

Antes de começar, verifique se você possui instalados em sua máquina:

* **Node.js v18+** (para front e backend)
* **npm**, **yarn** ou **pnpm**
* **Docker & Docker Compose** (para o banco de dados do backend)

---

## 🛠️ Instalação e Configuração

### Clonar o Repositório

1. Abra o terminal e clone este repositório:

   ```bash
   git clone git@github.com:kelwinv/sit-desafio.git
   ```
2. Entre na pasta raiz:

   ```bash
   cd sit-desafio
   ```

---

### Frontend

Entre na pasta `front` e siga os passos:

1. **Instale as dependências**

   ```bash
   cd front
   npm install
   # ou yarn install
   # ou pnpm install
   ```

2. **Configurar variáveis de ambiente**

   Crie um arquivo `.env` na raiz de `front` com o conteúdo:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3333
   ```

3. **Iniciar a aplicação em modo desenvolvimento**

   ```bash
   npm run dev
   # ou yarn dev
   # ou pnpm dev
   ```

   A aplicação estará disponível em: [http://localhost:3000](http://localhost:3000)

---

### Backend (API)

Entre na pasta `api` e siga os passos:

1. **Instale as dependências**

   ```bash
   cd ../api
   npm install
   ```

2. **Configurar variáveis de ambiente**

   Os arquivos de exemplo `.env.development` e `.env.test` já estão presentes. Caso seja necessário, copie e ajuste conforme:

   ```bash
   cp .env.development .env
   ```

   Ajuste as variáveis de conexão com o banco, se desejar.

3. **Subir serviços Docker para banco de dados**

   ```bash
   npm run services:up
   ```

   Isso iniciará um container MySQL conforme especificado em `infra/db/compose.yml`.

4. **Rodar migrações e iniciar o servidor**

   ```bash
   npm run prisma:migrate:dev   # Executa as migrações
   npm run start:dev            # Inicia a API em modo desenvolvimento
   ```

   A API estará disponível em: [http://localhost:3333](http://localhost:3333)

---

## 📁 Estrutura de Pastas

```plaintext
sit-desafio/
├── cover.png                 # Capa da aplicação (imagem utilizada no README principal)
├── front/                    # Frontend (Next.js)
│   ├── public/               # Arquivos estáticos (imagens, fontes, etc)
│   ├── src/
│   │   ├── app/              # App Router (páginas e rotas Next.js)
│   │   │   ├── login/        # Página de login
│   │   │   ├── register/     # Página de registro
│   │   │   ├── (private)/    # Rotas protegidas
│   │   │   │   └── tasks/    # Dashboard de tarefas e rotas.
│   │   │   └── guards/       # Guardas de autenticação
│   │   ├── components/       # Componentes React
│   │   │   ├── layout/       # Layouts (Navbar, AuthGuard, etc)
│   │   │   └── ui/           # Componentes de UI (shadcn)
│   │   ├── context/          # Context API (AuthContext)
│   │   ├── lib/              # Utilitários (API cliente)
│   │   └── types/            # Tipos TypeScript
│   ├── components.json       # Configuração do shadcn/ui
│   └── tailwind.config.js    # Configuração do Tailwind CSS
├── api/                      # Backend (NestJS + Prisma)
│   ├── infra/
│   │   ├── db/
│   │   │   └── compose.yml    # Configuração Docker Compose para MySQL
│   │   └── prisma/
│   │       ├── migrations/    # Migrações do Prisma
│   │       └── schema.prisma  # Schema do banco
│   ├── src/
│   │   ├── app.module.ts     # Módulo principal do NestJS
│   │   ├── auth/             # Módulo de autenticação
│   │   ├── tasks/            # Módulo de tarefas
│   │   ├── users/            # Módulo de usuários
│   │   ├── health/           # Endpoint de health check
│   │   ├── prisma/           # Cliente e configurações do Prisma
│   │   └── main.ts           # Ponto de entrada da aplicação
│   ├── swagger.json          # Definição do Swagger (OpenAPI)
│   ├── test/                 # Testes unitários e de integração
│   ├── package.json
│   └── tsconfig.json
├── README.md                 # README principal (este arquivo)
└── ...                       # Outros arquivos de configuração e scripts
```

---

## Frontend: Páginas e Rotas

### Páginas Públicas

* `/` - Página inicial (redireciona para login se não autenticado)
* `/login` - Página de login
* `/register` - Página de registro

### Páginas Privadas (requerem autenticação)

* `/tasks` - Dashboard principal com lista de tarefas
* `/tasks/new` - Formulário para criar nova tarefa
* `/tasks/[id]` - Visualização e edição de tarefa específica

---

## Backend: Endpoints Principais

### Autenticação

* `POST /auth/register` - Registrar novo usuário
* `POST /auth/login` - Fazer login e obter token JWT

### Tarefas

* `POST /tasks` - Criar nova tarefa
* `GET /tasks` - Listar todas as tarefas do usuário
* `GET /tasks?status=pending` - Filtrar tarefas por status (`pending`, `in-progress`, `completed`)
* `GET /tasks/:id` - Buscar tarefa por ID
* `PUT /tasks/:id` - Atualizar tarefa existente
* `DELETE /tasks/:id` - Excluir tarefa

### Outros

* `GET /health` - Verificar saúde da API (response simples)

---

## 🧪 Scripts Disponíveis

### Frontend

| Script          | Descrição                                             |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento (localhost:3000) |
| `npm run build` | Build para produção                                   |
| `npm run start` | Inicia servidor de produção                           |
| `npm run lint`  | Executa ESLint                                        |

### Backend

| Script                       | Descrição                                          |
| ---------------------------- | -------------------------------------------------- |
| `npm run start:dev`          | Inicia a API em modo desenvolvimento (`--watch`)   |
| `npm run start:prod`         | Inicia a API em modo produção                      |
| `npm run test`               | Executa todos os testes                            |
| `npm run test:watch`         | Executa testes em modo watch                       |
| `npm run test:cov`           | Executa testes com coverage                        |
| `npm run prisma:generate`    | Gera o client do Prisma                            |
| `npm run prisma:studio`      | Abre o Prisma Studio                               |
| `npm run prisma:migrate:dev` | Cria/Executa migrações no banco de dados           |
| `npm run prisma:reset:dev`   | Reseta o banco de dados de desenvolvimento         |
| `npm run services:up`        | Sobe containers Docker para banco de dados (MySQL) |
| `npm run services:stop`      | Para os containers                                 |
| `npm run services:down`      | Remove os containers                               |

---

## 📚 Documentação

### Swagger UI

A documentação interativa da API (endpoints, schemas, exemplos) está disponível em:

```
http://localhost:3333/api
```

---

## 🔒 Segurança

* Senhas criptografadas com **bcrypt**
* Autenticação baseada em **JWT**
* Validação de entrada de dados (DTOs e pipes do NestJS)
* Isolamento de dados por usuário (cada usuário acessa apenas suas próprias tarefas)
* Validação de UUID para parâmetros de rota


## 📜 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---
