const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (knownErrors, { defaultTo500 = true } = {}) => (err, req, res, next) => {
  const { name, status, message } = err;

  const knownError = Object.values(knownErrors).some(({ name: n }) => name === n);
  if (knownError) {
    res.status(status).json({ message });
  } else if (defaultTo500) {
    res.status(500).json({ message: 'internal error' });
    logger.error('unhandled error', err);
  } else {
    next(err);
  }
};

module.exports = errorHandler;
