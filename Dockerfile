#Base ##################################################################################################################
FROM node:21 AS base

WORKDIR /app
COPY package.json package-lock.json .

#PROD ##################################################################################################################

FROM base as prod-deps
RUN npm install --production

FROM prod-deps as prod
COPY src src
USER node

#DEV ###################################################################################################################

FROM base as dev-deps
RUN npm install

FROM dev-deps as lint
COPY .eslintrc.js .
COPY src src
RUN npm run lint

FROM lint as test
RUN wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
RUN dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
RUN npm test
USER node
