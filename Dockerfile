# Base
# use non alpine for mongodb-memory-server
FROM node:21 AS base
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install
COPY src src

# lint
FROM base as lint
COPY .eslintrc.js .
RUN npm run lint

# test
FROM lint as test
COPY jest.config.js .
# mongodb-memory-server dependencies
RUN wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
RUN dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
RUN npm test

# prod
FROM node:21-alpine AS prod
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install --production
COPY --from=test /app/src src
USER node
CMD npm start

# dev
FROM base as dev
USER node
CMD npm run dev
