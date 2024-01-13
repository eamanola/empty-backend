const bcrypt = require('bcrypt');
// const crypto = require('crypto');

const {
  createParamError,
  userNotFoundError,
  invalidPasswordError,
  emailNotVerifiedError,
} = require('../../errors');
const { info } = require('../../logger');
const { encode: encodeToken } = require('../../token');
const { findOne } = require('../../models/users');

const loginSchema = require('../../validators/login');

const login = async ({ email, password }, { REQUIRE_VERIFIED_EMAIL = false } = {}) => {
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

  if (REQUIRE_VERIFIED_EMAIL && user.emailVerified !== true) {
    throw emailNotVerifiedError;
  }

  /*
  const hash = crypto
    .createHash('md5')
    .update(`${user.email}${user.passwordHash}`)
    .digest('hex');
  */
  const token = encodeToken({ userId: user.id /* , hash */ });

  return token;
};

module.exports = login;
