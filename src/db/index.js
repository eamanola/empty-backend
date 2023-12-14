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

  deleteMany,
  count,
} = require('./mongo');

const isTest = NODE_ENV === 'test';

module.exports = {
  initDB,
  connectDB,
  closeDB,
  findOne: (table, where) => findOne(table, where),
  insertOne: (table, data) => insertOne(table, data),
  replaceOne: (table, where, replacement) => replaceOne(table, where, replacement),
  deleteOne: (table, where) => deleteOne(table, where),
  find: (table, where, options = {}) => find(table, where, options),

  deleteMany: (table, where) => isTest && deleteMany(table, where),
  count: (table, where) => isTest && count(table, where),
};
