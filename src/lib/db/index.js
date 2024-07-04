const { NODE_ENV } = require('../../config');

const { tableSchema } = require('./validators');

const {
  closeDB,
  connectDB,
  count,
  createTable,
  deleteAll,
  deleteOne,
  dropTable,
  find,
  findOne,
  fromDB,
  initDB,
  insertOne,
  hasClient,
  replaceOne,
  toDB,
  updateOne,
} = require('./mongo');

const callbacks = [];

module.exports = {
  closeDB: async () => closeDB(),
  connectDB: async () => {
    await connectDB();
    await Promise.all(callbacks.map((callback) => callback()));

    callbacks.length = 0;
  },
  createTable: async (table) => {
    await tableSchema.validate(table);

    if (hasClient()) {
      await createTable(table);
    } else {
      callbacks.push(() => createTable(table));
    }
  },
  deleteOne: async (tableName, where = {}) => deleteOne(tableName, where),
  find: async (tableName, where = {}, { limit, offset } = {}) => (
    find(tableName, where, { limit, offset })
  ),
  findOne: async (tableName, where) => findOne(tableName, where),
  fromDB: (row, columns) => fromDB(row, columns),
  initDB: async (...args) => initDB(...args),
  insertOne: async (tableName, row) => insertOne(tableName, row),
  // TODO deprecate, use update instead;
  replaceOne: async (tableName, where, newRow) => replaceOne(tableName, where, newRow),
  toDB: (obj) => toDB(obj),
  updateOne: async (tableName, where, updates, options = {}) => (
    updateOne(tableName, where, updates, options)
  ),
};

if (NODE_ENV === 'test') {
  module.exports.count = (tableName, where = {}) => count(tableName, where);
  module.exports.deleteAll = (tableName, where = {}) => deleteAll(tableName, where);
  module.exports.dropTable = (tableName) => dropTable(tableName);
}
