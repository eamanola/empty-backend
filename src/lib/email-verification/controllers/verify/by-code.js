const { invalidEmailVerificationCodeError } = require('../../errors');
const { findOne } = require('../../model');
const { setVerified } = require('../set-status');

const verifyByCode = async (email, sentCode) => {
  const { code } = await findOne(email);

  if (sentCode !== code) {
    throw invalidEmailVerificationCodeError;
  }

  return setVerified(email);
};

module.exports = verifyByCode;
