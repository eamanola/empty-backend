const {
  string,
  object,
  boolean,
} = require('yup');

const noteSchema = object({
  imageUrl: string().url().nullable(),
  isPublic: boolean().required(),
  text: string().required(),
}).noUnknown().strict();

module.exports = noteSchema;
