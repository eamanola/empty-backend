const { decode: decodeEmailVerificationToken } = require('../../../utils/token');
const { EMAIL_VERIFICATION_SECRET } = require('../../config');
const logger = require('../../../utils/logger');
const verifyByCode = require('./by-code');

const verifyByLink = async (token) => {
  const { code, email, byLink } = decodeEmailVerificationToken(token, EMAIL_VERIFICATION_SECRET);

  try {
    await verifyByCode(email, code);

    return byLink.onSuccess;
  } catch (err) {
    logger.info(err);
    return byLink.onFail;
  }
};

module.exports = verifyByLink;
