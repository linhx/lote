FROM node:16-alpine as build-stage

WORKDIR /apps
COPY ./be/package.json ./be/package-lock.json ./be/
RUN npm install --prefix ./be

COPY ./be ./be
RUN npm run build --prefix ./be


FROM node:16-alpine as production-stage
WORKDIR /apps

ARG START_MODE

ENV START_MODE=${START_MODE}
ENV BE_DIR=/apps/be

COPY --from=build-stage /apps/be/dist ${BE_DIR}/dist
COPY --from=build-stage /apps/be/.env ${BE_DIR}/.env
COPY --from=build-stage /apps/be/node_modules ${BE_DIR}/node_modules

COPY ./start-be.sh ./start-be.sh

EXPOSE 3000
ENTRYPOINT ["sh", "/apps/start-be.sh"]
