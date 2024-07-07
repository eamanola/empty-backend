const db = require('automata-db');
const cache = require('automata-cache');
const { middlewares, errors } = require('automata-utils');

const app = require('./app');
const rest = require('./rest');

const { errorHandler } = middlewares;

module.exports = {
  app,
  cache,
  db,
  errors,
  middlewares: {
    errorHandler,
  },
  rest,
};
