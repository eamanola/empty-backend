const { findOne } = require('../../../users/model');
const { decode: decodeEmailVerificationToken } = require('../../../utils/token');
const { SECRET } = require('../../../../config');
const logger = require('../../../utils/logger');
const verifyByCode = require('./by-code');

const verifyByLink = async (token) => {
  const { code, email, byLink } = decodeEmailVerificationToken(token, SECRET);

  try {
    const user = await findOne({ email });
    await verifyByCode(user, code);

    return byLink.onSuccess;
  } catch (err) {
    logger.info(err);
    return byLink.onFail;
  }
};

module.exports = verifyByLink;
