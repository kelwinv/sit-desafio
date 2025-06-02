# 📦 GiftWise (Desafio PixelHouse)

Monorepo contendo:

1. **GiftWise API**
   Backend RESTful em NestJS + Prisma + TypeScript para gerenciamento de “presentes”.

2. **GiftWise Web**
   Frontend em Next.js + Tailwind CSS para consumir e exibir os “presentes” da API.

---

## 🗂️ Estrutura do Repositório

```
.
├── api/           # Backend NestJS + Prisma
│   ├── src/
│   ├── test/
│   ├── prisma/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env.example
│   └── package.json
│
└── web/           # Frontend Next.js + Tailwind CSS
    ├── app/                # Rotas (App Router)
    ├── components/
    ├── lib/                # Cliente de API
    ├── public/
    ├── styles/
    ├── .env.local.example
    └── package.json
```

---

## 🎯 Funcionalidades

### GiftWise API

* CRUD de presentes (`/gifts`)

  * **POST** `/gifts` — cria um presente
  * **GET** `/gifts` — lista todos
  * **GET** `/gifts/:id` — busca por ID
  * **PUT** `/gifts/:id` — atualiza por ID
  * **DELETE** `/gifts/:id` — remove por ID
* Validações com `class-validator`
* Testes unitários e de integração (Jest + Supertest)
* Docker + Docker Compose para banco (SQLite ou PostgreSQL)

### GiftWise Web

* Listagem e cadastro de presentes via modal
* Dark mode com `next-themes`
* Toasts de notificação (Sonner)
* Componentes acessíveis (Radix UI) e ícones (Lucide)
* Responsividade móvel / desktop

---

## 🚀 Setup

### 1. Clone o repositório

```bash
git clone https://github.com/kelwinv/desafio-pixelhouse
cd desafio-pixelhouse
```

### 2. GiftWise API

Este comando:
* Sobe os containers do banco de dados com Docker Compose
* Roda o script de inicialização com Prisma
* Inicia a aplicação com `--watch`

```bash
cd api
npm install
npm run start:dev
```

* A API estará em `http://localhost:3333`
* Para testes: `npm run test` (ele sobe e limpa o DB de teste automaticamente)

### 3. GiftWise Web

```bash
cd ../web
npm install
npm run dev
```

* O frontend roda em `http://localhost:3000` e consome `API_URL` definido em `.env`

---

## 📦 Scripts Disponíveis

### API

| Comando                   | Descrição                                          |                                    |
| ------------------------- | -------------------------------------------------- | ---------------------------------- |
| `npm run start`           | Inicia sem hot-reload (produção)                   |                                    |
| `npm run start:dev`       | Inicia com hot-reload                              |                                    |
| `npm run build`           | Compila para `dist`                                |                                    |
| `npm run test`            | Testes unitários e integração                      |                                    |
| \`npm run services\:up    | down\`                                             | Sobe / Derruba containers do banco |
| `npm run lint:eslint:fix` | Corrige problemas de lint                          |                                    |
| `npm run prisma:*`        | Gera cliente, aplica migrations, abre Studio, etc. |                                    |

### Web

| Comando         | Descrição                      |
| --------------- | ------------------------------ |
| `npm run dev`   | Inicia em modo desenvolvimento |
| `npm run build` | Gera build de produção         |
| `npm run start` | Serve build em produção        |
| `npm run lint`  | Executa ESLint                 |

---

## 🎨 Tech Stack

| Camada   | Ferramentas                                                                     |
| -------- | ------------------------------------------------------------------------------- |
| Backend  | Node.js, NestJS, TypeScript, Prisma, Jest, Supertest                            |
| Banco    | SQLite / PostgreSQL (via Docker Compose)                                        |
| Frontend | Next.js (App Router), React 19, Tailwind CSS 4, Radix UI, Lucide, Sonner, Luxon |
| Infra    | Docker, Docker Compose, dotenv-cli                                              |
| QA       | ESLint, Prettier                                                                |

---