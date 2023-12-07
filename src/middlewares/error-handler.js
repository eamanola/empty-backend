const {
  emailTakenError,
  validationError,
  unknownError,
  userNotFoundError,
  invalidPasswordError,
} = require('../errors');

const {
  info,
  err: logError,
} = require('../logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { name, status, message } = err;

  switch (name) {
    case emailTakenError.name:
    case unknownError.name:
    case userNotFoundError.name:
    case invalidPasswordError.name:
      res.status(status).json({ message });

      break;

    case validationError.name:
      res.status(validationError.status).json({ message });
      info(message);
      break;

    default:
      res.status(500).json({ message: 'internal error' });
      logError('unhandled error', err);
  }
};

module.exports = errorHandler;
