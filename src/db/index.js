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
  findOne: (table, criteria) => findOne(table, criteria),
  insertOne: (table, criteria) => insertOne(table, criteria),
  replaceOne: (table, criteria, replacement) => replaceOne(table, criteria, replacement),
  deleteOne: (table, criteria) => deleteOne(table, criteria),
  find: (table, criteria, options = {}) => find(table, criteria, options),

  deleteMany: (table, criteria) => isTest && deleteMany(table, criteria),
  count: (table, criteria) => isTest && count(table, criteria),
};
