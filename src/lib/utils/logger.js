const { NODE_ENV } = require('../../config');

const error = console.error.bind(console);

const info = NODE_ENV === 'test'
  ? () => null
  : console.info.bind(console);

const warn = console.warn.bind(console);

const logger = {
  error,
  info,
  warn,
};

module.exports = logger;
