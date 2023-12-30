const {
  findOne: dbFindOne,
  insertOne: dbInsertOne,
  replaceOne: dbReplaceOne,
  deleteOne: dbDeleteOne,
  find: dbFind,
} = require('../db');

const noteSchema = require('../validators/note');

const table = 'Notes';

const insertOne = async (note) => {
  await noteSchema.validate(note);

  return dbInsertOne(
    table,
    {
      ...note,
      modified: new Date(),
    },
  );
};

const findOne = (where) => dbFindOne(table, where);

const find = (where, options) => dbFind(table, where, options);

const replaceOne = async (where, { modified, id, ...replacement }) => {
  if (!id) {
    throw new Error('id is required');
  }

  await noteSchema.validate(replacement);

  return dbReplaceOne(
    table,
    where,
    {
      ...replacement,
      modified: new Date(),
    },
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
