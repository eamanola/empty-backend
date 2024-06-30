const { sessionExipred } = require('../errors');
const { accessDenied } = require('../../errors');
const { decode: decodeToken } = require('../../utils/token');
const { SECRET } = require('../../../config');
const { findOne } = require('../model');
const { isValidSession } = require('./session');

const fromToken = async (token) => {
  try {
    if (token) {
      const { userId: id, session } = decodeToken(token, SECRET);
      const user = await findOne({ id });

      if (!isValidSession(user, session)) {
        throw sessionExipred;
      }

      delete user.passwordHash;
      return user;
    }

    return null;
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw accessDenied;
    }

    throw err;
  }
};

module.exports = fromToken;
