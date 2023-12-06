const {
  emailTakenError,
  validationError,
} = require('../errors');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { name, status, message } = err;

  switch (name) {
    case emailTakenError.name:
      res.status(status).json({ message });

      break;

    case validationError.name:
      res.status(validationError.status).json({ message });
      // eslint-disable-next-line no-console
      console.log(message);
      break;
    default:
      // eslint-disable-next-line no-console
      console.log('unhandled error', err);
      res.status(500).json({ message: 'internal error' });
  }
};

module.exports = errorHandler;
