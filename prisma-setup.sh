#!/bin/sh

echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
  nc -z db 5432 && break
  echo "Postgres not ready, sleeping..."
  sleep 2
done

echo "🚀 Running Prisma migrations for the main database..."
npx prisma migrate dev --name init

echo "🔧 Generating Prisma client for the main database..."
npx prisma generate

echo "� Setting up the test database..."
export DATABASE_URL="postgresql://postgres:postgres@db:5432/db_test"
npx prisma migrate reset --force --skip-seed
npx prisma generate

echo "�🟢 Starting the app..."
npm run start:debug