const { string, object } = require('yup');

const userResourceSchema = object({
  owner: string().required(),
}).noUnknown().strict();

module.exports = userResourceSchema;
