# lote

Linhx's note

## Features

- CRUD note.
- Publish a note as a Vuejs component for better SPA.
- Only build the note when published, not entire project.
- Emoji

## TODO

- [ ] Notify after performing asynchronous processing (publish, unpublish, delete...)

## Tech stack

1. Backend: Nestjs + Mongodb
2. Admin frontend: Vuejs + Quilljs + Tailwinds
3. Frontend: Vuejs + Tailwinds + Highlightjs

## Prerequire

- Node v16.15.0
- Mongodb >= v4.0

## Development

### Run

```shell
sudo docker-compose up
```

### Init mongo

Setup replica set after the mongo container has completly started.

```shell
sudo docker exec -it lote-mongo-1 sh /scripts/init.sh
```

## Deployment

### Backend (be)

1. Update .env: base on .prod.env

2. Run

    ```shell
    cd be
    npm i
    npm start
    ```

3. Manage by using PM2 or installing as a Linux service.

NOTE: for authentication, I'm using an authentication server to validate the access token from cookie.
You should change the strategy to your.

### Admin frontend (admin-fe)

1. Update .env

2. Run

    ```shell
    cd admin-fe
    npm i
    npm run build
    ```

3. Deploy the `dist` using a Web server like: nginx or apache2

NOTE: for authentication, I'm using an authentication server to validate the access token from cookie.
You should change the strategy to your.

### Frontend (fe)

1. Update .env
    VITE_APP_DEPLOY_DIR: the deploy directory

2. Run

    ```shell
    cd fe
    npm i
    npm run build
    ```

3. Deploy the `dist` using a Web server like: nginx or apache2
