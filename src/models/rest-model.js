const {
  findOne: dbFindOne,
  insertOne: dbInsertOne,
  replaceOne: dbReplaceOne,
  deleteOne: dbDeleteOne,
  find: dbFind,
} = require('../db');

const restModel = ({ table, validator }) => {
  const insertOne = async (note) => {
    await validator.validate(note);

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

    await validator.validate(replacement);

    return dbReplaceOne(
      table,
      where,
      {
        ...replacement,
        modified: new Date(),
      },
    );
  };

  const deleteOne = (where) => !!where.id && dbDeleteOne(table, where);

  return {
    table,
    insertOne,
    findOne,
    find,
    replaceOne,
    deleteOne,
  };
};

module.exports = restModel;
