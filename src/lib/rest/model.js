const { randomUUID } = require('node:crypto');

const { NODE_ENV } = require('../../config');

const yupFromTable = require('../db/utils/yup-from-table');

const {
  findOne: dbFindOne,
  insertOne: dbInsertOne,
  replaceOne: dbReplaceOne,
  deleteOne: dbDeleteOne,
  find: dbFind,
  createTable: dbCreateTable,
} = require('../db');

const { resourceSchema, userResourceSchema } = require('./validators');

const restModel = (
  { columns: extraColumns, name: tableName },
  { userRequired = true, validator: customValidator = null } = {},
) => {
  const reserved = ['id', 'owner', 'modified'];
  if (extraColumns.some(({ name }) => reserved.includes(name))) {
    throw Error(`${reserved.join(', ')} are reserved column names`);
  }

  const columns = [
    ...extraColumns,
    { name: 'id', required: true, type: 'string' },
    { name: 'modified', required: true, type: 'string' },
  ];
  if (userRequired) columns.push({ name: 'owner', required: true, type: 'string' });

  const table = { columns, name: tableName };

  const createTable = async () => dbCreateTable(table);

  let shape;
  const setShape = async () => {
    const validator = customValidator || await yupFromTable(table);

    shape = (userRequired ? validator.concat(userResourceSchema) : validator)
      .concat(resourceSchema);
  };

  const init = async () => {
    await setShape();
    await createTable();
  };
  init();

  const insertOne = async (newRow) => {
    const row = { ...newRow, id: randomUUID(), modified: new Date() };

    await shape.validate(row);

    await dbInsertOne(tableName, row);

    return { id: row.id };
  };

  const findOne = (where) => dbFindOne(tableName, where);

  const find = (where, options) => dbFind(tableName, where, options);

  const replaceOne = async (where, replacement) => {
    if (!where.id) {
      throw new Error('id is required');
    }

    const newRow = { ...replacement, modified: new Date() };
    await shape.validate(newRow);

    return dbReplaceOne(tableName, where, newRow);
  };

  const deleteOne = ({ id, ...where }) => !!id && dbDeleteOne(tableName, { ...where, id });

  return {
    deleteOne,
    find,
    findOne,
    init: NODE_ENV === 'test' ? init : undefined,
    insertOne,
    replaceOne,
  };
};

module.exports = restModel;
