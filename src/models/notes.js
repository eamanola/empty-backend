const {
  findOne,
  insertOne,
  replaceOne,
  deleteOne,
  find,
} = require('../db');

const noteSchema = require('../validators/note');
const newNoteSchema = require('../validators/new-note');

const table = 'Notes';

module.exports = {
  table,
  insertOne: async (newNote) => {
    await newNoteSchema.validate(newNote);

    return insertOne(
      table,
      {
        ...newNote,
        created: new Date(),
        modified: new Date(),
      },
    );
  },
  findOne: (criteria) => findOne(table, criteria),
  find: (criteria) => find(table, criteria),
  replaceOne: async (note) => {
    await noteSchema.validate(note);

    return replaceOne(
      table,
      {
        ...note,
        modified: new Date(),
      },
    );
  },
  deleteOne: ({ id }) => deleteOne(table, { id }),
};
