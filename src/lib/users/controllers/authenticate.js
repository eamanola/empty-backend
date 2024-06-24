const bcrypt = require('bcrypt');
const { userNotFoundError, invalidPasswordError, emailNotVerifiedError } = require('../errors');
const { createParamError } = require('../../errors');

const logger = require('../../utils/logger');
const { encode: encodeToken } = require('../utils/token');
const { findOne } = require('../model');
const { getSession } = require('./session');

const loginSchema = require('../validators/login');

const login = async ({ email, password }, { REQUIRE_VERIFIED_EMAIL = false } = {}) => {
  try {
    await loginSchema.validate({ email, password });
  } catch (err) {
    logger.info(err.message);
    throw createParamError(err);
  }

  const user = await findOne({ email });
  if (!user) {
    throw userNotFoundError;
  }

  if (!await bcrypt.compare(password, user.passwordHash)) {
    throw invalidPasswordError;
  }

  if (REQUIRE_VERIFIED_EMAIL && user.emailVerified !== true) {
    throw emailNotVerifiedError;
  }

  const token = encodeToken({ session: getSession(user), userId: user.id });

  return token;
};

module.exports = login;
