const { NODE_ENV } = require('../../config');

// eslint-disable-next-line no-console
const info = (...args) => NODE_ENV !== 'test' && console.log(...args);
// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);
// eslint-disable-next-line no-console
const err = (...args) => console.error(...args);

module.exports = { info, log, err };
