const {
  string,
  object,
} = require('yup');

const userSchema = object({
  email: string().email().required(),
  passwordHash: string().required(),
});

module.exports = userSchema;
