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

  deleteMany,
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

  deleteMany: (table, where) => isTest && deleteMany(table, where),
  count: (table, where) => isTest && count(table, where),
};
