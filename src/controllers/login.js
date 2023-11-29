const bcrypt = require('bcrypt');

const { encode: encodeToken } = require('../token');

const { findOne } = require('../models/users');

const loginSchema = require('../validators/login');

const login = async (credentials) => {
  await loginSchema.validate(credentials);

  const { email, password } = credentials;

  const user = await findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (!await bcrypt.compare(password, user.passwordHash)) {
    throw new Error('Invalid password');
  }

  return encodeToken({ email });
};

module.exports = login;
