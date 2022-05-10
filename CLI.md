# Command-line

Here is a list of my custom scrips, commands and procedures, related to the app deployment.

## Reverse proxy for the app

```bash
sudo a2proxy 'stasks' '48004'
```

```bash
sudo a2proxy 'stasks' remove
```

## Docker container for the app

```bash
# docker run -p '48004':'48004' 'stasks' -d
```

```bash
docker-compose up -d
```

```bash
docker-compose down
```

```bash
docker-prune.sh
```

## [PM2](https://www.npmjs.com/package/pm2) service for the app

```bash
cd app/
npm install
```

```bash
pm2 start 'npm run watch' --name 'stasks'
pm2 save
```

```bash
pm2 start 'npm start' --name 'stasks'
pm2 save
```

```bash
pm2 stop 'stasks'
pm2 delete 'stasks'
pm2 save
```
