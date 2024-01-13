const { invalidEmailVerificationCodeError } = require('../../../../errors');
const { setVerified } = require('../set-status');

const verifyByCode = async (user, code) => {
  if (user.emailVerificationCode !== code) {
    throw invalidEmailVerificationCodeError;
  }

  return setVerified(user.id);
};

module.exports = verifyByCode;
