#Base ##################################################################################################################
FROM node:21-alpine AS prod
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install --production
COPY src src
USER node
CMD npm start

#DEV ###################################################################################################################
FROM node:21 AS base
WORKDIR /app
COPY package.json package-lock.json .

FROM base as dev-deps
RUN npm install
COPY src src

FROM dev-deps as lint
COPY .eslintrc.js .
RUN npm run lint

FROM lint as test
RUN wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
RUN dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
RUN npm test

FROM test as dev
USER node
CMD npm run dev
