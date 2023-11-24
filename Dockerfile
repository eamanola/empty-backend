#Base ##################################################################################################################
FROM node:21-alpine AS base

WORKDIR /app
COPY package.json package-lock.json .
COPY src src

#PROD ##################################################################################################################

FROM base as prod-deps
RUN npm install --production
USER node

FROM prod-deps as prod

#DEV ###################################################################################################################

FROM base as dev-deps
RUN npm install
USER node

FROM dev-deps as lint
COPY .eslintrc.js .
RUN npm run lint
