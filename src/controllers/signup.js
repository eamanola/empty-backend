const bcrypt = require('bcrypt');

const { info } = require('../logger');
const { createParamError, emailTakenError } = require('../errors');
const signupSchema = require('../validators/signup');
const { findOne, insertOne } = require('../models/users');

const saltRounds = 11;

const isEmailTaken = ({ email }) => findOne({ email });

const signup = async ({ email, password }) => {
  try {
    await signupSchema.validate({ email, password });
  } catch (e) {
    info(e);
    throw createParamError(e);
  }

  if (await isEmailTaken({ email })) {
    throw emailTakenError;
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  return insertOne({ email, passwordHash });
};

module.exports = signup;
