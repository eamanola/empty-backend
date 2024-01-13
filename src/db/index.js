const { NODE_ENV } = require('../config');

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
  initDB,
  connectDB,
  closeDB,
  findOne,
  insertOne,
  replaceOne,
  deleteOne,
  find: (table, where, options = {}) => find(table, where, options),
  updateOne,

  deleteAll: (table, where) => isTest && deleteAll(table, where),
  count: (table, where) => isTest && count(table, where),
};
