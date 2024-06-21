const { emailVerifiedError, userNotFoundError } = require('../../../errors');
const { findOne } = require('../../../models/users');
const sendEmailVerificationMail = require('../../../utils/send-email-verification-mail');
const { encode: encodeEmailVerificationToken } = require('../../../utils/token');
const { info } = require('../../../utils/logger');
const { setUnverified } = require('./set-status');

const request = async ({ email }, { byCode = null, byLink = null }) => {
  const user = await findOne({ email });
  if (!user) {
    throw userNotFoundError;
  }

  if (user.emailVerified) {
    throw emailVerifiedError;
  }

  let code;
  try {
    code = await setUnverified(user.id, code);
  } catch (e) {
    info(e);
    throw e;
  }

  const token = byLink ? encodeEmailVerificationToken({ userId: user.id, byLink, code }) : null;

  sendEmailVerificationMail({
    to: user.email,
    code: byCode ? code : null,
    byCode,
    token,
  });
};

module.exports = request;
