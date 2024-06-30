const { NODE_ENV } = require('../../config');

const {
  initDB,
  connectDB,
  createTable,
  closeDB,
  findOne,
  insertOne,
  replaceOne,
  deleteOne,
  find,
  updateOne,

  deleteAll,
  count,
} = require('./mongo');

module.exports = {
  closeDB,
  connectDB,
  createTable,
  deleteOne,
  find: (table, where, options = {}) => find(table, where, options),
  findOne,
  initDB,
  insertOne,
  replaceOne,
  updateOne,
};

if (NODE_ENV === 'test') {
  module.exports.count = (table, where) => count(table, where);
  module.exports.deleteAll = (table, where) => deleteAll(table, where);
}
