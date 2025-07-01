

docker-compose down --rmi all --volumes --remove-orphans
docker-compose up  --build -d
docker-compose exec admin-app npx ts-node /app/prisma/seed.ts
