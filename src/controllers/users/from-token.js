const { accessDenied } = require('../../errors');
const { decode: decodeToken } = require('../../token');
const { findOne } = require('../../models/users');

const fromToken = async (token) => {
  try {
    if (token) {
      const decodedToken = decodeToken(token);
      const user = await findOne(decodedToken);
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
