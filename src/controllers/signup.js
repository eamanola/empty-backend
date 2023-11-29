const bcrypt = require('bcrypt');

const { findOne, insertOne } = require('../models/users');

const signupSchema = require('../validators/signup');

const saltRounds = 11;

const emailTaken = ({ email }) => findOne({ email });

const signup = async (credentials) => {
  await signupSchema.validate(credentials);

  const { email, password } = credentials;

  if (await emailTaken({ email })) {
    throw new Error('email taken');
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  return insertOne({ email, passwordHash });
};

module.exports = signup;
