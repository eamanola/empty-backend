const bcrypt = require('bcrypt');

const {
  createParamError,
  userNotFoundError,
  invalidPasswordError,
  accessDenied,
} = require('../errors');
const { info } = require('../logger');
const { encode: encodeToken, decode: decodeToken } = require('../token');
const { findOne } = require('../models/users');

const loginSchema = require('../validators/login');

const login = async ({ email, password }) => {
  try {
    await loginSchema.validate({ email, password });
  } catch (e) {
    info(e.message);
    throw createParamError(e);
  }

  const user = await findOne({ email });
  if (!user) {
    throw userNotFoundError;
  }

  if (!await bcrypt.compare(password, user.passwordHash)) {
    throw invalidPasswordError;
  }

  const token = encodeToken({ email });

  return token;
};

const userFromToken = async (token) => {
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

module.exports = {
  login,
  userFromToken,
};
