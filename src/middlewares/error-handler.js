const {
  emailTakenError,
  userNotFoundError,
  invalidPasswordError,
  paramError,
  accessDenied,
} = require('../errors');

const { err: logError } = require('../logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { name, status, message } = err;

  switch (name) {
    case emailTakenError.name:
    case userNotFoundError.name:
    case invalidPasswordError.name:
    case paramError.name:
    case accessDenied.name:
      res.status(status).json({ message });

      break;

    default:
      res.status(500).json({ message: 'internal error' });
      logError('unhandled error', err);
  }
};

module.exports = errorHandler;
