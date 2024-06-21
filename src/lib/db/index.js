const { NODE_ENV } = require('../../config');

const {
  initDB,
  connectDB,
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

const isTest = NODE_ENV === 'test';

module.exports = {
  closeDB,
  connectDB,
  count: (table, where) => isTest && count(table, where),
  deleteAll: (table, where) => isTest && deleteAll(table, where),
  deleteOne,
  find: (table, where, options = {}) => find(table, where, options),
  findOne,
  initDB,
  insertOne,
  replaceOne,
  updateOne,
};
