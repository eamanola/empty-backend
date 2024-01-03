const bcrypt = require('bcrypt');

const {
  createParamError,
  userNotFoundError,
  invalidPasswordError,
} = require('../../errors');
const { info } = require('../../logger');
const { encode: encodeToken } = require('../../token');
const { findOne } = require('../../models/users');

const loginSchema = require('../../validators/login');

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

  const token = encodeToken({ userId: user.id });

  return token;
};

module.exports = login;
