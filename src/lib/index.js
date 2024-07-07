const db = require('automata-db');
const cache = require('automata-cache');

const app = require('./app');
const errorHandler = require('./middlewares/error-handler');
const errors = require('./errors');
const rest = require('./rest');

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
