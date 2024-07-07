// const { userNotFoundError } = require('../../users/errors');
const { emailVerifiedError } = require('../errors');
const { findOne } = require('../model');
const sendEmailVerificationMail = require('../utils/send-email-verification-mail');
const { encode: encodeEmailVerificationToken } = require('../../utils/token');
const { SECRET } = require('../../../config');
const logger = require('../../utils/logger');
const { setUnverified } = require('./set-status');

const request = async (email, { byCode = null, byLink = null }) => {
  // if (!user) {
  //   throw userNotFoundError;
  // }
  const oldRequest = await findOne(email);

  const alreadyVerified = oldRequest !== null && oldRequest.code === null;
  if (alreadyVerified) {
    throw emailVerifiedError;
  }

  let code;
  try {
    code = await setUnverified(email);
  } catch (err) {
    logger.info(err);
    throw err;
  }

  const token = byLink
    ? encodeEmailVerificationToken({ byLink, code, email }, SECRET, { expiresIn: '1d' })
    : null;

  sendEmailVerificationMail({
    byCode,
    code: byCode ? code : null,
    to: email,
    token,
  });
};

module.exports = request;
