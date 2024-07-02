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
  initDB,
  insertOne,
  hasClient,
  replaceOne,
  updateOne,
} = require('./sqlite');

const callbacks = [];

module.exports = {
  closeDB: async () => closeDB(),
  connectDB: async () => {
    await connectDB();
    await Promise.all(callbacks.map((callback) => callback()));

    callbacks.length = 0;
  },
  createTable: async (table, schema) => {
    await tableSchema.validate({ schema, table });

    if (hasClient()) {
      await createTable(table, schema);
    } else {
      callbacks.push(() => createTable(table, schema));
    }
  },
  deleteOne: async (table, where = {}) => deleteOne(table, where),
  find: async (table, where = {}, { limit, offset } = {}) => (
    find(table, where, { limit, offset })
  ),
  findOne: async (table, where) => findOne(table, where),
  initDB: async (...args) => initDB(...args),
  insertOne: async (table, row) => insertOne(table, row),
  // TODO deprecate, use update instead;
  replaceOne: async (table, where, newRow) => replaceOne(table, where, newRow),
  updateOne: async (table, where, updates, options = {}) => (
    updateOne(table, where, updates, options)
  ),
};

if (NODE_ENV === 'test') {
  module.exports.count = (table, where = {}) => count(table, where);
  module.exports.deleteAll = (table, where = {}) => deleteAll(table, where);
  module.exports.dropTable = (table) => dropTable(table);
}
