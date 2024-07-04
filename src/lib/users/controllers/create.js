const bcrypt = require('bcrypt');

const logger = require('../../utils/logger');
const { emailTakenError } = require('../errors');
const { createParamError } = require('../../errors');
const signupSchema = require('../validators/signup');
const { findOne, insertOne } = require('../model');
const { setUnverified } = require('../../email-verification/controllers/set-status');

const saltRounds = 11;

const isEmailTaken = ({ email }) => findOne({ email });

const signup = async ({ email, password }) => {
  try {
    await signupSchema.validate({ email, password });
  } catch (err) {
    logger.info(err.message);
    throw createParamError(err);
  }

  if (await isEmailTaken({ email })) {
    throw emailTakenError;
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const { id: userId } = await insertOne({ email, passwordHash });

  await setUnverified(userId);
};

module.exports = signup;
