const {
  string,
  object,
  boolean,
} = require('yup');

const newNoteSchema = object({
  text: string().required(),
  imageUrl: string().url().nullable(),
  public: boolean().required(),
});

module.exports = newNoteSchema;
