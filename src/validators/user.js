const {
  string,
  object,
  number,
} = require('yup');

const userSchema = object({
  email: string().email().required(),
  passwordHash: string().required(),
  emailVerificationCode: number()
    .positive()
    .integer()
    .min(100 * 1000)
    .max(1 * 1000 * 1000)
    .nullable(),
}).noUnknown().strict();

module.exports = userSchema;
