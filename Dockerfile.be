FROM node:16-alpine as build-stage

WORKDIR /apps
COPY ./be/package.json ./be/package-lock.json ./be/
RUN npm install --prefix ./be

COPY ./fe/package.json ./fe/package-lock.json ./fe/
RUN npm install --prefix ./fe

COPY ./be ./be
RUN npm run build --prefix ./be


FROM node:16-alpine as production-stage
WORKDIR /apps

ARG FE_DIR
ARG START_MODE

ENV FE_DIR=${FE_DIR}
ENV START_MODE=${START_MODE}
ENV BE_DIR=/apps/be

COPY --from=build-stage /apps/be/dist ${BE_DIR}/dist
COPY --from=build-stage /apps/be/.env ${BE_DIR}/.env
COPY --from=build-stage /apps/be/bin ${BE_DIR}/bin
COPY --from=build-stage /apps/be/node_modules ${BE_DIR}/node_modules

COPY ./fe ${FE_DIR}
COPY --from=build-stage /apps/fe/node_modules ${FE_DIR}/node_modules

COPY ./start-be.sh ./start-be.sh

EXPOSE 3000
ENTRYPOINT ["sh", "/apps/start-be.sh"]
