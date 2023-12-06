const bcrypt = require('bcrypt');

const { findOne, insertOne } = require('../models/users');

const signupSchema = require('../validators/signup');

const { emailTakenError, unknownError } = require('../errors');

const saltRounds = 11;

const isEmailTaken = ({ email }) => findOne({ email });

const signup = async (credentials) => {
  await signupSchema.validate(credentials);

  const { email, password } = credentials;

  if (await isEmailTaken({ email })) {
    throw emailTakenError;
  }

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return insertOne({ email, passwordHash });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    throw unknownError;
  }
};

module.exports = signup;
