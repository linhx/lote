# lote

Linhx's note

## Tech stack

1. Backend: Nestjs + Mongodb
2. Admin frontend: Vuejs + Ckeditor5 + Tailwinds
3. Frontend: Nextjs + Tailwinds

Weird stack. I know, right?
In [the first version](https://github.com/linhx/lote/tree/feature/fe-vue), the Frontend was Vuejs. I made it as a static SPA + partially publish + Prefetching. Everything was good until I want to do SEO and add today-i-learned section, it's getting hard to maintain. Then I switch to Nextjs, because I feel like Nuxt is not good enough, beside, I want to learn react also.

## Prerequire

- Node v16.15.0
- Mongodb >= v4.0

## Development

### Run

```shell
sudo docker compose -f ./docker-compose.dev.yml up
```

### Init mongo

Setup replica set after the mongo container has completly started.

```shell
sudo docker exec -it lote-mongo-1 sh /scripts/init.sh
```

## Deployment

### Docker

```shell
docker compose up -d
```

Setup replica set after the mongo container has completly started.

```shell
docker compose exec mongo sh /scripts/init.sh
```

### Manually

#### Backend (be)

1. Update .env: base on .prod.env

2. Run

    ```shell
    cd be
    npm i
    npm start
    ```

3. Manage by using PM2 or installing as a Linux service.

#### Admin frontend (admin-fe)

1. Update .env

2. Run

    ```shell
    cd admin-fe
    npm i
    npm run build
    ```

3. Deploy the `dist` using a Web server like: nginx or apache2

#### Frontend (fe)

1. Update .env

2. Run

    ```shell
    cd fe
    npm i
    npm start
    ```

3. Manage by using PM2 or installing as a Linux service.
