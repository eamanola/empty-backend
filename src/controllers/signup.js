const bcrypt = require('bcrypt');

const { DB } = require('../mongo');
const signupSchema = require('../validators/signup');

const table = 'Users';
const saltRounds = 11;

const emailTaken = ({ email }) => DB().collection(table).findOne({ email });

const signup = async (credentials) => {
  await signupSchema.validate(credentials);

  const { email, password } = credentials;

  if (await emailTaken({ email })) {
    throw new Error('email taken');
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  return DB().collection(table).insertOne({ email, passwordHash });
};

module.exports = {
  table,
  signup,
};
