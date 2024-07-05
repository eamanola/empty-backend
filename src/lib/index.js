// const usersRouter = require('./users/router');
// const emailVerificationRouter = require('./email-verification/router');

// const errors = require('./errors');
// const { errorHandler } = require('./middlewares');
// const rest = require('./rest');
const app = require('./app');
const cache = require('./cache');
const db = require('./db');

module.exports = {
  app,
  cache,
  db,
  // emailVerificationRouter,
  // errorHandler,
  // errors,
  // rest,
  // usersRouter,
};
