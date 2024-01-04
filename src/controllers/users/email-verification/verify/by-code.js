const { invalidEmailVerificationCodeError } = require('../../../../errors');
const { updateOne } = require('../../../../models/users');
const { info } = require('../../../../logger');

const setEmailVerified = async ({ id, emailVerificationCode }) => {
  try {
    await updateOne({ id, emailVerificationCode }, { emailVerificationCode: null });
  } catch (e) {
    info(e);
    throw e;
  }
};

const verifyByCode = async (user, code) => {
  if (user.emailVerificationCode !== code) {
    throw invalidEmailVerificationCodeError;
  }

  return setEmailVerified({ id: user.id, emailVerificationCode: code });
};

module.exports = verifyByCode;
