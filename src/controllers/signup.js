const bcrypt = require('bcrypt');

const { findOne, insertOne } = require('../models/users');

const signupSchema = require('../validators/signup');

const {
  createParamError,
  emailTakenError,
} = require('../errors');

const { info } = require('../logger');

const saltRounds = 11;

const isEmailTaken = ({ email }) => findOne({ email });

const signup = async (credentials) => {
  try {
    await signupSchema.validate(credentials);
  } catch (e) {
    info(e);
    throw createParamError(e);
  }

  const { email, password } = credentials;

  if (await isEmailTaken({ email })) {
    throw emailTakenError;
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);
  return insertOne({ email, passwordHash });
};

module.exports = signup;
