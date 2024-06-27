const usersRouter = require('./users/router');
const emailVerificationRouter = require('./email-verification/router');

const errors = require('./errors');
const { errorHandler } = require('./middlewares');
const rest = require('./rest');

module.exports = {
  emailVerificationRouter,
  errorHandler,
  errors,
  rest,
  usersRouter,
};
