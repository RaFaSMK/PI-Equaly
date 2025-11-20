# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Instalar netcat para healthcheck
RUN apk add --no-cache netcat-openbsd

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm install --only=production

# Copiar código e prisma client do builder
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/tsconfig.json ./

# Instalar tsx globalmente para rodar TypeScript
RUN npm install -g tsx

# Expor porta
EXPOSE 3333

# Script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["tsx", "watch", "src/server.ts"]
