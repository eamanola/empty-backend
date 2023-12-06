const bcrypt = require('bcrypt');

const { encode: encodeToken } = require('../token');

const { findOne } = require('../models/users');

const loginSchema = require('../validators/login');

const {
  userNotFoundError,
  invalidPasswordError,
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

  return encodeToken({ email });
};

module.exports = login;
