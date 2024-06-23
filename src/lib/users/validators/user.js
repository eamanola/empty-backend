const {
  string,
  object,
  number,
} = require('yup');

const userSchema = object({
  email: string().email().required(),
  emailVerificationCode: number()
    .positive()
    .integer()
    .min(100 * 1000)
    .max(1 * 1000 * 1000)
    .nullable(),
  passwordHash: string().required(),
}).noUnknown().strict();

module.exports = userSchema;
