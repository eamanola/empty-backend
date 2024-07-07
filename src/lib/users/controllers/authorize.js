const { utils, errors } = require('automata-utils');

const { sessionExipred } = require('../errors');
const { SECRET } = require('../../../config');
const { findOne } = require('../model');
const { isValidSession } = require('./session');

const { token: loginToken } = utils;
const { decode } = loginToken;

const { accessDenied } = errors;

const fromToken = async (token) => {
  try {
    if (token) {
      const { userId: id, session } = decode(token, SECRET);
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
