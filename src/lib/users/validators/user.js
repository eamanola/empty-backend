const { string, object/* , number */ } = require('yup');

const userSchema = object({
  email: string().email().required(),
  id: string().required(),
  passwordHash: string().required(),
}).noUnknown().strict();

module.exports = userSchema;
