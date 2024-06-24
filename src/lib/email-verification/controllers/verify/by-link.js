const { findOne } = require('../../../users/model');
const { decode: decodeEmailVerificationToken } = require('../../../users/utils/token');
const logger = require('../../../utils/logger');
const verifyByCode = require('./by-code');

const verifyByLink = async (token) => {
  const { code, userId, byLink } = decodeEmailVerificationToken(token);

  try {
    const user = await findOne({ id: userId });
    await verifyByCode(user, code);

    return byLink.onSuccess;
  } catch (err) {
    logger.info(err);
    return byLink.onFail;
  }
};

module.exports = verifyByLink;
