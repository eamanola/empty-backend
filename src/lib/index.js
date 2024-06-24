const usersRouter = require('./users/router');
const errors = require('./errors');
const { errorHandler } = require('./middlewares');
const rest = require('./rest');

module.exports = {
  errorHandler: errorHandler(errors),
  rest,
  usersRouter,
};
