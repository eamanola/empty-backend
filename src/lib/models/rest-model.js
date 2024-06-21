const {
  findOne: dbFindOne,
  insertOne: dbInsertOne,
  replaceOne: dbReplaceOne,
  deleteOne: dbDeleteOne,
  find: dbFind,
} = require('../db');

const userResourece = require('../validators/user-resource');

const restModel = (table, validator, { userRequired = true } = {}) => {
  const shape = userRequired ? userResourece.concat(validator) : validator;

  const insertOne = async (row) => {
    await shape.validate(row);

    return dbInsertOne(
      table,
      { ...row, modified: new Date() },
    );
  };

  const findOne = (where) => dbFindOne(table, where);

  const find = (where, options) => dbFind(table, where, options);

  const replaceOne = async (where, { modified, id, ...replacement }) => {
    if (!id) {
      throw new Error('id is required');
    }

    await shape.validate(replacement);

    return dbReplaceOne(
      table,
      where,
      { ...replacement, modified: new Date() },
    );
  };

  const deleteOne = (where) => !!where.id && dbDeleteOne(table, where);

  return {
    deleteOne,
    find,
    findOne,
    insertOne,
    replaceOne,
    table,
  };
};

module.exports = restModel;
