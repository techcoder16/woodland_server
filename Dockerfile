FROM node:18
WORKDIR /app

# Copy root package.json and package-lock.json if any
COPY package*.json ./

# Install all dependencies (including prisma, ts-node, etc)
RUN npm install
RUN npm install -D ts-node typescript
RUN npm install bcrypt
RUN npm install -D @types/bcrypt


# Copy whole project (prisma folder, Admin folder, etc)
COPY . .

# Generate Prisma client (point schema path to prisma folder)
RUN npx prisma generate --schema=./prisma/schema.prisma

# Remove this line - it causes the error:
# RUN npx ts-node  ./prisma/seed.ts

# Expose app port
EXPOSE 5002

# Start app from Admin folder using nodemon + ts-node
WORKDIR /app/Admin
CMD ["npx", "nodemon", "--watch", ".", "--ext", "ts,json", "--exec", "npx ts-node index.ts"]
