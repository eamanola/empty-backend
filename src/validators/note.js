const {
  string,
  date,
  object,
} = require('yup');

const newNoteSchema = require('./new-note');

const noteSchema = newNoteSchema.concat(
  object({
    id: string().required(),
    created: date().required(),
    modified: date().required(),
  }),
);

module.exports = noteSchema;
