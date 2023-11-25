const bcrypt = require('bcrypt');

const { DB } = require('../mongo');
const loginSchema = require('../validators/login');
const { encode: encodeToken } = require('../token');
const { table } = require('./signup');

const login = async (credentials) => {
  await loginSchema.validate(credentials);

  const { email, password } = credentials;

  const user = await DB().collection(table).findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (!await bcrypt.compare(password, user.passwordHash)) {
    throw new Error('Invalid password');
  }

  return encodeToken({ email });
};

module.exports = {
  table,
  login,
};
