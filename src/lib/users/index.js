const errors = require('./errors');
const { emailVerification, login, signup } = require('./routes');
const { authorization } = require('./middlewares');

module.exports = {
  authorization,
  emailVerification,
  errors,
  login,
  signup,
};
