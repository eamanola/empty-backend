const { findOne } = require('../../../../models/users');
const { decode: decodeEmailVerificationToken } = require('../../../../token');
const { info } = require('../../../../logger');
const verifyByCode = require('./by-code');

const verifyByLink = async (token) => {
  const {
    code,
    userId,
    byLink,
  } = decodeEmailVerificationToken(token);

  try {
    const user = await findOne({ id: userId });
    await verifyByCode(user, code);

    return byLink.onSuccess;
  } catch (e) {
    info(e);
    return byLink.onFail;
  }
};

module.exports = verifyByLink;
