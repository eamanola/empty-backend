FROM node:21-alpine AS BASE

WORKDIR /app
COPY package.json package-lock.json .
RUN npm install

USER node
COPY src src
