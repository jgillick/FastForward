# FastForward Golinks
A simple golink service for managing short versions on long URLs. Authentication is provided by Google oAuth.

## Run Locally
Everything can be run locally inside of [docker](https://www.docker.com/products/docker-desktop) with these commands:

### 1. Copy default settings

This file contains the environment variable for all the app settings.

```bash
cp env.example .env
```

### 1. Setup Google OAuth Credentials
This project requires on simple authentication, managed by google. So first you'll need to go to the [Google console](https://console.developers.google.com/) and setup some credentials.

1. Goto the [Google console](https://console.developers.google.com/)
2. Select an existing project or create a new one.
3. Click **credentials** in the sidebar
4. Click **+ CREATE CREDENTIALs**
5. Select **Web application**
6. Give it a name
7. Add "http://localhost:3000" as an Authorized origins.
8. Click **Create*
10. Now copy the Client ID and assign it to `GOOGLE_CLIENT_ID`, in the `.env` file.

```
GOOGLE_CLIENT_ID=xxxxyyyyzzzz.apps.googleusercontent.com
```

### 2. Build and launch containers

```bash
docker-compose build
docker-compose up -d
```

### 3. Setup the DB

```bash
docker-compose exec app npm run prisma:migrations

# Fix the size of the URL field (prisma defaults it to 192)
docker-compose exec db mysql -hdb -uroot -proot -Dfastforward -e "alter table Link modify url varchar(2048) not null;"
```

## 5. Finish up

```bash
docker-compose restart app
```

Now goto http://localhost:3000
