FROM node:18

WORKDIR /app

# Copy Admin app
COPY Admin/package*.json ./Admin/
RUN cd Admin && npm install

COPY Admin ./Admin
COPY prisma ./prisma

# Generate Prisma client
WORKDIR /app/Admin
RUN npx prisma generate

EXPOSE 5002
CMD ["npm", "start"]

