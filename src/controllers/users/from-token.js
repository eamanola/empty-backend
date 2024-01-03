const { accessDenied } = require('../../errors');
const { decode: decodeToken } = require('../../token');
const { findOne } = require('../../models/users');

const fromToken = async (token) => {
  try {
    if (token) {
      const { userId: id } = decodeToken(token);
      const user = await findOne({ id });
      delete user.passwordHash;
      return user;
    }

    return null;
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      throw accessDenied;
    }
    throw e;
  }
};

module.exports = fromToken;
