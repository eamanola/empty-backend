const bcrypt = require('bcrypt');
const { utils, errors } = require('automata-utils');

const { userNotFoundError, invalidPasswordError, emailNotVerifiedError } = require('../errors');
const { SECRET } = require('../../../config');
const { findOne } = require('../model');
const { getSession } = require('./session');
const { isVerified } = require('../../email-verification/controllers/set-status');
const loginSchema = require('../validators/login');

const { logger, token: loginToken } = utils;
const { encode } = loginToken;

const { createParamError } = errors;

const login = async (
  { email, password },
  { REQUIRE_VERIFIED_EMAIL = false } = {},
) => {
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

  const emailVerified = await isVerified(email);
  if (REQUIRE_VERIFIED_EMAIL && emailVerified !== true) {
    throw emailNotVerifiedError;
  }

  if (!await bcrypt.compare(password, user.passwordHash)) {
    throw invalidPasswordError;
  }

  const token = encode({ session: getSession(user), userId: user.id }, SECRET);

  return { emailVerified, token };
};

module.exports = login;
