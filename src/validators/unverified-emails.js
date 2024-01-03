const {
  string,
  object,
} = require('yup');

const unverifiedEmailsSchema = object({
  userId: string().required(),
  newEmail: string().email().required(),
}).noUnknown().strict();

module.exports = unverifiedEmailsSchema;
