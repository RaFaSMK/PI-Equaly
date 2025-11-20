#!/bin/sh
set -e

echo "🔄 Aguardando PostgreSQL..."
until nc -z postgres 5432; do
  sleep 1
done

echo "✅ PostgreSQL está pronto!"

echo "🔄 Rodando migrations..."
npx prisma migrate deploy

echo "🔄 Rodando seed..."
npx tsx prisma/seed.ts || true

echo "🚀 Iniciando servidor..."
exec "$@"
