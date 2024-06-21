# Base
# use non alpine for mongodb-memory-server
FROM node:22 AS base
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install

# prod specific
FROM base AS prod-base
# pre-download memory-server-binaries
COPY ./bin/download-memory-server-binaries.js .
ENV MONGOMS_VERSION=7.0.11
ENV RUNTIME_DOWNLOAD=true
RUN node ./download-memory-server-binaries.js
# dev uses src as volumes
COPY src src

# lint
FROM prod-base as lint
COPY .eslintrc.cjs .
COPY .eslintignore .
RUN npm run lint

# test
FROM lint as test
COPY jest.config.cjs .
RUN npm test

# build
FROM test as build
COPY webpack.config.cjs .
RUN npm run build

# prod
FROM node:22-alpine AS prod
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install --omit=dev
COPY --from=build /app/dist/index.bundle.js src/index.js
USER node
CMD npm start

# dev
FROM base as dev
USER node
CMD npm run dev
