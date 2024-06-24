const usersRouter = require('./users/router');
const errors = require('./errors');
const { errorHandler } = require('./middlewares');
const restRouter = require('./rest-router');

module.exports = {
  errorHandler: errorHandler(errors),
  restRouter,
  usersRouter,
};
