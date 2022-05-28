# Command-line

Here is a list of my custom scrips, commands and procedures, related to the app deployment. Here are provided two ways how to run the application - via Docker  or via PM2. In both cases it is served at `http://localhost:48004` and to be accessible at the public interface via I'm using Apache2 as HTTPS Reverse Proxy.

## Reverse proxy for the application

```bash
sudo a2proxy 'stasks' '48004'
```

```bash
sudo a2proxy 'stasks' remove
```

[`a2proxy`](https://github.com/metalevel-tech/a2proxy) is a Bash script that generates Apache2 reverse proxy virtual host configuration files, used in my dev lab.

## Docker container for the application

Run the application by `docker`. The following command will use the file `Dockerfile` directly. When the building is finished the application will be available at `http://localhost:48004`.

```bash
docker run -p '48004':'48004' 'stasks' -d
```

Or better use `docker-compose` that makes the overall containers management much easier. The following command will use the configuration file `docker-compose.yml` and the *build* command inside will use the file `Dockerfile`.

```bash
docker-compose up -d
```

```bash
docker-compose down
```

```bash
docker-prune.sh
```

How to install `docker` and `docker-compose` on Ubuntu, and what have inside my script `docker-prune.sh` is decried in the article [Docker Basic Setup](https://wiki.szs.space/wiki/Docker_Basic_Setup) at my wiki.

## PM2 service for the app

Run the application by Node.js via [PM2](https://www.npmjs.com/package/pm2).

```bash
cd app && npm i && npm run build && cd -
```

```bash
cd server && npm i && npm run db-create && cd -
```

```bash
cd server
pm2 start 'npm run supervisor' --name 'stasks'
# pm2 start 'npm start' --name 'stasks'
pm2 save
```

```bash
pm2 stop 'stasks'
pm2 delete 'stasks'
pm2 save
```
