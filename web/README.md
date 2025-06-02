# Tasks App Frontend

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React para produção
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes reutilizáveis
- **React Context** - Gerenciamento de estado de autenticação
- **Sonner** - Sistema de notificações toast
- **Lucide React** - Ícones modernos

## 📦 Funcionalidades

### Autenticação
- ✅ Página de registro de usuários
- ✅ Página de login
- ✅ Proteção de rotas privadas
- ✅ Gerenciamento de sessão com Context API
- ✅ Logout automático

### Interface de Tarefas
- ✅ Dashboard com listagem de tarefas
- ✅ Filtros por status (Pendente, Em Progresso, Concluída)
- ✅ Criação de novas tarefas
- ✅ Visualização detalhada de tarefas
- ✅ Edição de tarefas existentes
- ✅ Exclusão de tarefas
- ✅ Interface responsiva

### Experiência do Usuário
- ✅ Componentes com design system consistente
- ✅ Badges de status coloridos
- ✅ Notificações toast para feedback
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Navegação intuitiva

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (v18 ou superior)
- npm, yarn ou pnpm
- Tasks API rodando (veja README da API)

### Passos para instalação

1. **Clone o repositório**
```bash
git clone git@github.com:kelwinv/sit-desafio.git
cd front
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie o arquivo .env

NEXT_PUBLIC_API_URL=http://localhost:3333

```

4. **Inicie a aplicação**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📱 Páginas e Rotas

### Públicas
- `/` - Página inicial (redireciona para login se não autenticado)
- `/login` - Página de login
- `/register` - Página de registro

### Privadas (Requerem autenticação)
- `/tasks` - Dashboard principal com lista de tarefas
- `/tasks/new` - Formulário para criar nova tarefa
- `/tasks/[id]` - Visualização e edição de tarefa específica

## 🎨 Componentes

### Layout
- **Navbar** - Navigation header com menu do usuário
- **AuthGuard** - Proteção de rotas privadas
- **TaskCard** - Card individual de tarefa
- **TaskForm** - Formulário para criar/editar tarefas
- **TaskFilter** - Filtros por status
- **StatusBadge** - Badge colorido para status das tarefas

### UI Components (shadcn/ui)
- Alert, Avatar, Badge, Button
- Card, Dialog, DropdownMenu
- Input, Label, Progress
- Select, Textarea, Sonner (Toast)

## 🔧 Configuração da API

O frontend se comunica com a Tasks API através do arquivo `src/lib/api.ts`. Certifique-se de que:

1. A API esteja rodando em `http://localhost:3333`
2. A variável `NEXT_PUBLIC_API_URL` esteja configurada
3. Os endpoints da API estejam acessíveis

## 🎯 Fluxo de Autenticação

1. **Registro**: Usuário preenche nome, email e senha
2. **Login**: Validação de credenciais e recebimento de token JWT
3. **Armazenamento**: Token salvo no Context e localStorage
4. **Proteção**: Rotas privadas verificam autenticação
5. **Logout**: Limpeza do token e redirecionamento

## 📁 Estrutura do Projeto

```
front/
├── public/                 # Arquivos estáticos
├── src/
│   ├── app/               # App Router (Next.js 13+)
│   │   ├── login/         # Página de login
│   │   ├── register/      # Página de registro
│   │   ├── (private)/     # Rotas protegidas
│   │   │   └── tasks/     # Dashboard de tarefas
│   │   └── guards/        # Guards de autenticação
│   ├── components/        # Componentes React
│   │   ├── layout/        # Componentes de layout
│   │   └── ui/           # Componentes UI (shadcn)
│   ├── context/          # Context API
│   ├── lib/              # Utilitários e configurações
│   └── types/            # Tipos TypeScript
├── components.json       # Configuração shadcn/ui
└── tailwind.config.js   # Configuração Tailwind
```

## 🧪 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |
