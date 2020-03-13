# FastForward
Simple go links service behind Google Auth.

```
de app npm run prisma:migrations
de db mysql -hdb -uroot -p -Dfastforward -e "alter table Link modify url varchar(2048) not null;"
```

## Other useful commands

```
npx prisma2 generate --schema=./backend/prisma/schema.prisma
de app npx prisma2 migrate save --name "Initial migration" --experimental --schema=backend/prisma/schema.prisma
```
