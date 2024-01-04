const bcrypt = require('bcrypt');

const { info } = require('../../logger');
const { createParamError, emailTakenError } = require('../../errors');
const signupSchema = require('../../validators/signup');
const { findOne, insertOne } = require('../../models/users');
const { getCode } = require('./email-verification');

const saltRounds = 11;

const isEmailTaken = ({ email }) => findOne({ email });

const signup = async ({ email, password }) => {
  try {
    await signupSchema.validate({ email, password });
  } catch (e) {
    info(e.message);
    throw createParamError(e);
  }

  if (await isEmailTaken({ email })) {
    throw emailTakenError;
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);
  const emailVerificationCode = getCode();

  return insertOne({ email, passwordHash, emailVerificationCode });
};

module.exports = signup;
