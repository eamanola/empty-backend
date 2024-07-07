const { decode: decodeEmailVerificationToken } = require('../../../utils/token');
const { SECRET } = require('../../../../config');
const logger = require('../../../utils/logger');
const verifyByCode = require('./by-code');

const verifyByLink = async (token) => {
  const { code, email, byLink } = decodeEmailVerificationToken(token, SECRET);

  try {
    await verifyByCode(email, code);

    return byLink.onSuccess;
  } catch (err) {
    logger.info(err);
    return byLink.onFail;
  }
};

module.exports = verifyByLink;
