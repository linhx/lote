# lote

Linhx's note

## TODO

- [ ] View note on development mode

## Prerequire

- Node v16.15.0
- Mongodb >= v4.0

## Development

## Init mongo

Setup replica set

Access mongodb in docker

```shell
sudo docker exec -it lote_mongo_1 mongo -u root -p root
```

Then run

```javascript
rs.initiate();
```

## Run

```shell
sudo docker-compose up
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
