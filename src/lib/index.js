const usersRouter = require('./users/router');
const emailVerificationRouter = require('./email-verification/router');

const errors = require('./errors');
const { errorHandler } = require('./middlewares');
const rest = require('./rest');

const app = require('./app');

module.exports = {
  app,
  emailVerificationRouter,
  errorHandler,
  errors,
  rest,
  usersRouter,
};
