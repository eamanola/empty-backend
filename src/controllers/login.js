const bcrypt = require('bcrypt');

const { encode: encodeToken } = require('../token');
const { info } = require('../logger');
const {
  createParamError,
  userNotFoundError,
  invalidPasswordError,
} = require('../errors');
const { findOne } = require('../models/users');
const loginSchema = require('../validators/login');

const login = async ({ email, password }) => {
  try {
    await loginSchema.validate({ email, password });
  } catch (e) {
    info(e);
    throw createParamError(e);
  }

  const user = await findOne({ email });
  if (!user) {
    throw userNotFoundError;
  }

  if (!await bcrypt.compare(password, user.passwordHash)) {
    throw invalidPasswordError;
  }

  return encodeToken({ email });
};

module.exports = login;
