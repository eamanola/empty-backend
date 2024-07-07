const { string, object, number } = require('yup');

const yup = object({
  code: number()
    .positive()
    .integer()
    .min(100 * 1000)
    .max(1 * 1000 * 1000)
    .nullable(),
  email: string().email().required(),
}).noUnknown().strict();

module.exports = yup;
