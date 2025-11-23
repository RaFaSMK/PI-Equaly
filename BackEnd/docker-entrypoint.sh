#!/bin/sh
set -e

echo "🔄 Aguardando PostgreSQL..."
until nc -z postgres 5432; do
  sleep 1
done

echo "✅ PostgreSQL está pronto!"

echo "📦 Instalando dependências..."
npm install

echo "🧩 Gerando Prisma Client..."
npx prisma generate

echo "🔄 Rodando migrations..."
npx prisma migrate deploy

if [ ! -f "/app/.seeded" ]; then
  echo "🌱 Rodando seed (primeira execução)..."
  npx prisma db seed || npx tsx prisma/seed.ts || true
  touch /app/.seeded
else
  echo "⏭️  Seed já executado anteriormente. Pulando."
fi

echo "🚀 Iniciando servidor..."
exec "$@"
