const { emailVerifiedError, userNotFoundError } = require('../../errors');
const { findOne } = require('../../model');
const sendEmailVerificationMail = require('../../utils/send-email-verification-mail');
const { encode: encodeEmailVerificationToken } = require('../../utils/token');
const logger = require('../../../utils/logger');
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
  } catch (err) {
    logger.info(err);
    throw err;
  }

  const token = byLink ? encodeEmailVerificationToken({ byLink, code, userId: user.id }) : null;

  sendEmailVerificationMail({
    byCode,
    code: byCode ? code : null,
    to: user.email,
    token,
  });
};

module.exports = request;
