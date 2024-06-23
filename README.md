# empty-backend

A base repo for backend development

## pre-req

either via docker, or

install redis, mongo, and node.

## Usage

### development

add your routes the and implementations to app.js.

see [example demo](https://github.com/eamanola/fullstack-demo-backend-node/blob/main/src/fullstack-demo-backend-node/app.js) for example.

### env

create .env.development.local, and .env.production.local in project root. see env.sample for
available options

### run

#### dev build

with docker

```./bin/dev.sh```

locally

```npm run dev```

#### production build

with docker

```./bin/start.sh```

locally

```
  npm run build
  npm run start
```

## reserved endpoints

see lib/app.js for up to date reserve endpoint

### /signup

for creating new users

### /login

for for authenticating users

### /email-verification

for verifying email

## notes

* Add ./lib/middlewares/error-handlers to the end of app.js. see [example demo](https://github.com/eamanola/fullstack-demo-backend-node/blob/main/src/fullstack-demo-backend-node/app.js) for howto.

## TODOs

* upgrade to eslint@9, when airbnb adds support
