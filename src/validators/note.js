const {
  string,
  object,
  boolean,
} = require('yup');

const noteSchema = object({
  text: string().required(),
  imageUrl: string().url().nullable(),
  isPublic: boolean().required(),
}).noUnknown().strict();

module.exports = noteSchema;
