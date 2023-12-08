const {
  string,
  date,
  object,
} = require('yup');

const newNoteSchema = require('./new-note');

const noteSchema = newNoteSchema.concat(
  object({
    id: string().required(),
    modified: date().required(),
  }),
).noUnknown().strict();

module.exports = noteSchema;
