const { findOne } = require('../../../../models/users');
const { decode: decodeToken } = require('../../../../token');
const { info } = require('../../../../logger');
const verifyByCode = require('./by-code');

const verifyByLink = async (token) => {
  const {
    code,
    userId,
    byLink,
  } = decodeToken(token);

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
