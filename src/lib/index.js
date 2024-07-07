const db = require('automata-db');
const app = require('./app');
const cache = require('./cache');
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
