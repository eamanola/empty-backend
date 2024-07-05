# base
# use non alpine for mongodb-memory-server
FROM node:22 AS base
WORKDIR /app
COPY package.json package-lock.json .
RUN HUSKY=0 npm install

# test specific
# cache memory-server-binaries before src/
FROM base AS prod-base
COPY ./bin/download-memory-server-binaries.js .
ENV MONGOMS_VERSION=7.0.11
ENV RUNTIME_DOWNLOAD=true
RUN node ./download-memory-server-binaries.js
# dev uses src as volumes
COPY src/config.js src/config.js
COPY src/lib src/lib

# lint
FROM prod-base AS lint
COPY .eslintrc.cjs .
COPY .eslintignore .
RUN npm run lint

# test
FROM lint AS test
COPY jest.config.cjs .
RUN npm test

# build
FROM test AS build
COPY webpack.config.cjs .
RUN npm run build

# prod
FROM node:22-alpine AS prod
WORKDIR /app
COPY package.json package-lock.json .
RUN HUSKY=0 npm install --omit=dev
COPY --from=build /app/dist/index.bundle.js dist/index.bundle.js
USER node
CMD npm start

# dev
FROM base AS dev
USER node
CMD npm run dev
