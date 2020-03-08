FROM node:13
WORKDIR /usr/src/app

ARG DATABASE_URL
ENV DATABASE_URL "$DATABASE_URL"

# Install npm packages
COPY package*.json ./
RUN npm install

# Generate prisma module and run migrations on the DB
COPY ./backend/prisma ./backend/prisma
RUN npx prisma2 generate --schema=./backend/prisma/schema.prisma
# RUN npx prisma2 migrate up --experimental --schema=backend/prisma/schema.prisma

CMD npm run dev
