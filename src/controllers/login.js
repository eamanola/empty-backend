const bcrypt = require('bcrypt');

const { encode: encodeToken } = require('../token');

const { findOne } = require('../models/users');

const loginSchema = require('../validators/login');

const { err } = require('../logger');

const {
  userNotFoundError,
  invalidPasswordError,
  unknownError,
} = require('../errors');

const login = async (credentials) => {
  await loginSchema.validate(credentials);

  const { email, password } = credentials;

  const user = await findOne({ email });
  if (!user) {
    throw userNotFoundError;
  }

  if (!await bcrypt.compare(password, user.passwordHash)) {
    throw invalidPasswordError;
  }

  try {
    return encodeToken({ email });
  } catch (e) {
    err(e);
    throw unknownError;
  }
};

module.exports = login;
