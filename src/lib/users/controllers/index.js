const authenticate = require('./authenticate');
const authorize = require('./authorize');
const create = require('./create');
const emailVerification = require('./email-verification');

module.exports = {
  authenticate,
  authorize,
  create,
  emailVerification,
};
