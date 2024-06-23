const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (knownErrors) => (err, req, res, next) => {
  const { name, status, message } = err;

  const knownError = Object.values(knownErrors).find(({ name: n }) => name === n);
  if (knownError) {
    res.status(status).json({ message });
  } else {
    res.status(500).json({ message: 'internal error' });
    logger.error('unhandled error', err);
  }
};

module.exports = errorHandler;
