const app = require('./app');
const cache = require('./cache');
const db = require('./db');
const errorHandler = require('./middlewares/error-handler');
const errors = require('./errors');

module.exports = {
  app,
  cache,
  db,
  errors,
  middlewares: {
    errorHandler,
  },
};
