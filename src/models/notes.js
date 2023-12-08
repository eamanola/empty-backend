const {
  findOne: dbFindOne,
  insertOne: dbInsertOne,
  replaceOne: dbReplaceOne,
  deleteOne: dbDeleteOne,
  find: dbFind,
} = require('../db');

const noteSchema = require('../validators/note');
const newNoteSchema = require('../validators/new-note');

const table = 'Notes';

const insertOne = async (newNote) => {
  await newNoteSchema.validate(newNote);

  return dbInsertOne(
    table,
    {
      ...newNote,
      modified: new Date(),
    },
  );
};

const findOne = (criteria) => dbFindOne(table, criteria);

const find = (criteria) => dbFind(table, criteria);

const replaceOne = async (criteria, replacement) => {
  const timeStamped = {
    ...replacement,
    modified: new Date(),
  };

  await noteSchema.validate(timeStamped);

  return dbReplaceOne(
    table,
    criteria,
    timeStamped,
  );
};

const deleteOne = (note) => !!note.id && dbDeleteOne(table, note);

module.exports = {
  table,
  insertOne,
  findOne,
  find,
  replaceOne,
  deleteOne,
};
