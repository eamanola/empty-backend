const errors = require('./errors');

const { errorHandler } = require('./middlewares');

const { authorization } = require('./users/middlewares');
const { emailVerification, login, signup } = require('./users/routes');
const userErrors = require('./users/errors');

const addMiddlewares = (app) => {
  app.post('/signup', signup);
  app.post('/login', login);

  app.use(authorization);

  app.use('/email-verification', emailVerification);

  const knownErrors = {
    ...errors,
    ...userErrors,
  };

  app.use(errorHandler(knownErrors));
};

module.exports = addMiddlewares;
