const {
  string,
  object,
} = require('yup');

const signupSchema = object({
  email: string().email().required(),
  password: string().required(),
});

module.exports = signupSchema;
