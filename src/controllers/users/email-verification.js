const { emailVerifiedError, invalidEmailVerificationCodeError } = require('../../errors');
const { updateOne, findOne } = require('../../models/users');
const sendEmailVerificationMail = require('../../utils/send-email-verification-mail');
const { encode: encodeToken, decode: decodeToken } = require('../../token');
const { info } = require('../../logger');

const setEmailVerified = async ({ id, emailVerificationCode }) => {
  try {
    await updateOne({ id, emailVerificationCode }, { emailVerificationCode: null });
  } catch (e) {
    info(e);
    throw e;
  }
};

const getCode = () => {
  const code = Math.floor(Math.random() * 1 * 1000 * 1000);
  return code > (100 * 1000) ? code : getCode();
};

const request = async (user, { byCode = null, byLink = null }) => {
  if (user.emailVerified) {
    throw emailVerifiedError;
  }

  const code = getCode();

  try {
    await updateOne({ id: user.id }, { emailVerificationCode: code });
  } catch (e) {
    info(e);
    throw e;
  }

  const token = byLink ? encodeToken({ userId: user.id, byLink, code }) : null;

  sendEmailVerificationMail({
    to: user.email,
    code: byCode ? code : null,
    byCode,
    token,
  });
};

const verifyByCode = async (user, code) => {
  if (user.emailVerificationCode !== code) {
    throw invalidEmailVerificationCodeError;
  }

  return setEmailVerified({ id: user.id, emailVerificationCode: code });
};

const verifyByLink = async (token) => {
  const {
    code,
    userId,
    byLink,
  } = decodeToken(token);

  try {
    const user = await findOne({ id: userId });
    await verifyByCode(user, code);

    return byLink.onSuccess;
  } catch (e) {
    info(e);
    return byLink.onFail;
  }
};

module.exports = {
  getCode,
  request,
  verifyByCode,
  verifyByLink,
};
