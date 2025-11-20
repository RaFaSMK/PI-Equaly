# PCD Workspace - Docker Setup

Este projeto foi dockerizado para facilitar o desenvolvimento e deployment.

## 📦 Estrutura

```
pcd-workspace/
├── BackEnd/                 # API Node.js + Express + Prisma
├── pcd-frontend/            # Frontend Next.js
├── docker-compose.yml       # Produção
└── docker-compose.dev.yml   # Desenvolvimento
```

## 🚀 Iniciar o Projeto

### Modo Desenvolvimento (Recomendado)

Com **hot reload** para backend e frontend:

```bash
# Subir todos os containers
docker-compose -f docker-compose.dev.yml up

# Ou em background
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f
```

Acessar:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3333/api
- **PostgreSQL**: localhost:5432

### Modo Produção

Build otimizado:

```bash
docker-compose up --build
```

## 🛠️ Comandos Úteis

### Ver status dos containers

```bash
docker-compose -f docker-compose.dev.yml ps
```

### Parar tudo

```bash
docker-compose -f docker-compose.dev.yml down
```

### Parar e remover volumes (limpar banco de dados)

```bash
docker-compose -f docker-compose.dev.yml down -v
```

### Acessar shell do backend

```bash
docker exec -it pcd-backend-dev sh
```

### Rodar migrations manualmente

```bash
docker exec -it pcd-backend-dev npx prisma migrate dev
```

### Ver logs de um serviço específico

```bash
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f postgres
```

## 🗄️ Banco de Dados

O PostgreSQL roda em um container separado com:

- **Usuário**: postgres
- **Senha**: postgres
- **Database**: pcd_database
- **Porta**: 5432

### Conectar via cliente externo (DBeaver, pgAdmin, etc.)

```
Host: localhost
Port: 5432
Database: pcd_database
User: postgres
Password: postgres
```

## 🔧 Variáveis de Ambiente

### Backend (.env.docker)

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/pcd_database?schema=public"
JWT_SECRET="dev-secret-key-change-in-production"
PORT=3333
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

## 📝 Migrations e Seed

No primeiro start, o backend automaticamente:

1. ✅ Aguarda o PostgreSQL ficar pronto
2. ✅ Roda as migrations (`prisma migrate deploy`)
3. ✅ Executa o seed (`tsx prisma/seed.ts`)

Para rodar novamente:

```bash
docker exec -it pcd-backend-dev npx prisma migrate dev --name nome_da_migration
docker exec -it pcd-backend-dev npx tsx prisma/seed.ts
```

## 🧹 Limpeza

### Remover containers, networks e volumes

```bash
docker-compose -f docker-compose.dev.yml down -v --remove-orphans
```

### Limpar tudo (incluindo imagens)

```bash
docker-compose -f docker-compose.dev.yml down -v --rmi all
```

## 🐛 Troubleshooting

### Backend não conecta ao PostgreSQL

```bash
# Verificar se o postgres está healthy
docker-compose -f docker-compose.dev.yml ps

# Ver logs do postgres
docker-compose -f docker-compose.dev.yml logs postgres
```

### Erro de permissão no entrypoint

```bash
# Dar permissão de execução
chmod +x BackEnd/docker-entrypoint.sh
```

### Rebuild completo

```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up
```

## 📚 Tecnologias

- **Backend**: Node.js 20, Express 5, Prisma 6, TypeScript
- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Database**: PostgreSQL 16
- **Containerização**: Docker & Docker Compose
