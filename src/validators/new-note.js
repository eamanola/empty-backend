const {
  string,
  object,
  boolean,
} = require('yup');

const newNoteSchema = object({
  text: string().required(),
  imageUrl: string().url().nullable(),
  public: boolean().required(),
  owner: string().required(),
}).noUnknown().strict();

module.exports = newNoteSchema;
