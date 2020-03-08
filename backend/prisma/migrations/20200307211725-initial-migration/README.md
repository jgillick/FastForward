# Migration `20200307211725-initial-migration`

This migration has been generated at 3/7/2020, 9:17:25 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `gothere`.`Link` (
    `createdAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `name` varchar(191) NOT NULL  ,
    `updatedAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `url` varchar(191) NOT NULL DEFAULT '' ,
    PRIMARY KEY (`name`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `gothere`.`Revision` (
    `createdAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `id` varchar(191) NOT NULL  ,
    `link` varchar(191) NOT NULL ,
    `url` varchar(191) NOT NULL DEFAULT '' ,
    `user` varchar(191) NOT NULL ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `gothere`.`RedirectLog` (
    `createdAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `id` varchar(191) NOT NULL  ,
    `ip` varchar(191)   ,
    `link` varchar(191) NOT NULL ,
    `userAgent` varchar(191)   ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `gothere`.`User` (
    `createdAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    `id` varchar(191) NOT NULL  ,
    `lastLogin` datetime(3)   ,
    `name` varchar(191) NOT NULL DEFAULT '' ,
    `picture` varchar(191)   ,
    `updatedAt` datetime(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
    PRIMARY KEY (`id`)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE  INDEX `link` ON `gothere`.`RedirectLog`(`link`)

ALTER TABLE `gothere`.`Revision` ADD FOREIGN KEY (`link`) REFERENCES `gothere`.`Link`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE

ALTER TABLE `gothere`.`Revision` ADD FOREIGN KEY (`user`) REFERENCES `gothere`.`User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE

ALTER TABLE `gothere`.`RedirectLog` ADD FOREIGN KEY (`link`) REFERENCES `gothere`.`Link`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200307211725-initial-migration
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,45 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "mysql"
+  url      = env("DATABASE_URL")
+}
+
+model Link {
+  name        String         @id
+  url         String
+  history     Revision[]
+  redirects   RedirectLog[]
+  createdAt   DateTime       @default(now())
+  updatedAt   DateTime       @updatedAt
+}
+
+model Revision {
+  id          String         @default(uuid()) @id
+  link        Link
+  url         String
+  user        User
+  createdAt   DateTime       @default(now())
+}
+
+model RedirectLog {
+  id         String    @default(uuid()) @id
+  link       Link
+  ip         String?
+  userAgent  String?
+  createdAt  DateTime  @default(now())
+
+  @@index([link], name: "link")
+}
+
+model User {
+  id          String      @default(uuid()) @id
+  name        String
+  picture     String?
+  revisions   Revision[]
+  lastLogin   DateTime?
+  createdAt   DateTime    @default(now())
+  updatedAt   DateTime    @updatedAt
+}
```


