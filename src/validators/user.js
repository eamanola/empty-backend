const {
  string,
  object,
} = require('yup');

const userSchema = object({
  email: string().email().required(),
  passwordHash: string().required(),
}).noUnknown().strict();

module.exports = userSchema;
