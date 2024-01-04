const { emailVerifiedError } = require('../../errors');
const { updateOne } = require('../../models/users');
const sendEmailVerificationMail = require('../../utils/send-email-verification-mail');
const { encode: encodeToken } = require('../../token');
const { log } = require('../../logger');

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
    log(e);
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

const verify = (/* token */) => {

};

module.exports = {
  getCode,
  request,
  verify,
};
