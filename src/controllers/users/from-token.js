const { accessDenied, sessionExipred } = require('../../errors');
const { decode: decodeToken } = require('../../token');
const { findOne } = require('../../models/users');
const { isValidSession } = require('./session');

const fromToken = async (token) => {
  try {
    if (token) {
      const { userId: id, session } = decodeToken(token);
      const user = await findOne({ id });

      if (!isValidSession(user, session)) {
        throw sessionExipred;
      }

      delete user.passwordHash;
      return user;
    }

    return null;
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      throw accessDenied;
    } else if (e.name === sessionExipred.name) {
      throw sessionExipred;
    }
    throw e;
  }
};

module.exports = fromToken;
