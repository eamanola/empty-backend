const {
  string,
  object,
  boolean,
} = require('yup');

const userResourceSchema = require('./user-resource');

const newNoteSchema = userResourceSchema.concat(
  object({
    text: string().required(),
    imageUrl: string().url().nullable(),
    isPublic: boolean().required(),
  }),
).noUnknown().strict();

module.exports = newNoteSchema;
