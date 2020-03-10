FROM node:13
WORKDIR /usr/src/app

ARG DATABASE_URL
ENV DATABASE_URL "$DATABASE_URL"

# Install npm packages
COPY package*.json ./
RUN npm install

COPY . .

# Generate prisma module and run migrations on the DB
RUN npx prisma2 generate --schema=./backend/prisma/schema.prisma

# Generate nexus schema typings
RUN npm run generate:nexus

CMD npm run dev
