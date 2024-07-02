const { randomUUID } = require('node:crypto');

const { NODE_ENV } = require('../../config');
const {
  findOne: dbFindOne,
  insertOne: dbInsertOne,
  replaceOne: dbReplaceOne,
  deleteOne: dbDeleteOne,
  find: dbFind,
  createTable: dbCreateTable,
} = require('../db');

const { resourceSchema, userResourceSchema } = require('./validators');

const restModel = (schema, table, validator, { userRequired = true } = {}) => {
  const shape = (userRequired ? validator.concat(userResourceSchema) : validator)
    .concat(resourceSchema);

  const createTable = async () => {
    const reserved = ['id', 'owner', 'modified'];
    if (schema.some(({ name }) => reserved.includes(name))) {
      throw Error(`${reserved.join(', ')} are reserved column names`);
    }
    const tableSchema = [
      ...schema,
      { name: 'id', required: true, type: 'string' },
      { name: 'modified', required: true, type: 'string' },
    ];
    if (userRequired) tableSchema.push({ name: 'owner', required: true, type: 'string' });

    await dbCreateTable(table, tableSchema);
  };

  createTable();

  const insertOne = async (newRow) => {
    const row = { ...newRow, id: randomUUID(), modified: new Date() };

    await shape.validate(row);

    await dbInsertOne(table, row);

    return { id: row.id };
  };

  const findOne = (where) => dbFindOne(table, where);

  const find = (where, options) => dbFind(table, where, options);

  const replaceOne = async (where, replacement) => {
    if (!where.id) {
      throw new Error('id is required');
    }

    const newRow = { ...replacement, modified: new Date() };
    await shape.validate(newRow);

    return dbReplaceOne(table, where, newRow);
  };

  const deleteOne = ({ id, ...where }) => !!id && dbDeleteOne(table, { ...where, id });

  return {
    createTable: NODE_ENV === 'test' ? createTable : undefined,
    deleteOne,
    find,
    findOne,
    insertOne,
    replaceOne,
    table,
  };
};

module.exports = restModel;
