FROM node:13
WORKDIR /usr/src/app

ARG DATABASE_URL
ENV DATABASE_URL "$DATABASE_URL"

# Install npm packages
COPY package.json ./
RUN npm install

# ts-node seems to need typescript installed globally in Docker.
RUN npm install -g typescript

# COPY tsconfig.json .
# COPY ./backend ./backend
COPY . .

# Generate prisma module and run migrations on the DB
# RUN npx prisma2 generate --schema=./backend/prisma/schema.prisma
RUN npm run prisma:generate

# Generate nexus schema typings
RUN npm run generate:nexus
# RUN NODE_ENV=development npx ts-node --transpile-only ./backend/graphql

RUN npx ts-node -e 'console.log(`test`)'

CMD npm run dev
