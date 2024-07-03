const { randomUUID } = require('node:crypto');

const { NODE_ENV } = require('../../config');

const yupFromTable = require('../db/utils/yup-from-table');

const { toDB, fromDB } = require('../db/sqlite/utils/type-conversion');

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
  { columns: extraColumns, indexes: extraIndexes = [], name: tableName },
  { userRequired = true, validator: customValidator = null } = {},
) => {
  const reserved = ['id', 'owner', 'modified'];
  if (extraColumns.some(({ name }) => reserved.includes(name))) {
    throw Error(`${reserved.join(', ')} are reserved column names`);
  }

  const columns = [
    ...extraColumns,
    { name: 'id', required: true, type: 'string' },
    { name: 'modified', required: true, type: 'date' },
  ];
  if (userRequired) columns.push({ name: 'owner', required: true, type: 'string' });

  const indexes = [
    ...extraIndexes,
    { columns: ['id'], name: 'id', unique: true },
  ];
  if (userRequired) {
    indexes.push({ columns: ['owner'], name: 'owner' });
    indexes.push({ columns: ['id', 'owner'], name: 'id_owner', unique: true });
  }

  const table = { columns, indexes, name: tableName };

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

    await dbInsertOne(tableName, toDB(row));

    return { id: row.id };
  };

  const findOne = async (where) => fromDB(await dbFindOne(tableName, toDB(where)), columns);

  const find = async (where, options) => (await dbFind(tableName, toDB(where), options) || [])
    .map((row) => fromDB(row, columns));

  const replaceOne = async (where, replacement) => {
    if (!where.id) {
      throw new Error('id is required');
    }

    const newRow = { ...replacement, modified: new Date() };
    await shape.validate(newRow);

    return dbReplaceOne(tableName, toDB(where), toDB(newRow));
  };

  const deleteOne = ({ id, ...where }) => !!id && dbDeleteOne(tableName, toDB({ ...where, id }));

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
