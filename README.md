# FastForward
Simple go links service behind Google Auth.

```
npx prisma2 generate --schema=./backend/prisma/schema.prisma
npx prisma2 migrate save --name "Initial migration" --experimental --schema=backend/prisma/schema.prisma
npx prisma2 migrate up --experimental --schema=backend/prisma/schema.prisma
```
