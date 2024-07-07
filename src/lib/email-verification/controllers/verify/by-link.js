const { utils } = require('automata-utils');
const { EMAIL_VERIFICATION_SECRET } = require('../../config');
const verifyByCode = require('./by-code');

const { logger, token: emailVerificationToken } = utils;
const { decode } = emailVerificationToken;

const verifyByLink = async (token) => {
  const { code, email, byLink } = decode(token, EMAIL_VERIFICATION_SECRET);

  try {
    await verifyByCode(email, code);

    return byLink.onSuccess;
  } catch (err) {
    logger.info(err);
    return byLink.onFail;
  }
};

module.exports = verifyByLink;
