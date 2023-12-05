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

module.exports = {
  initDB,
  connectDB,
  closeDB,
  findOne: (table, criteria) => findOne(table, criteria),
  insertOne: (table, criteria) => insertOne(table, criteria),
  replaceOne: (table, criteria, replacement) => replaceOne(table, criteria, replacement),
  deleteOne: (table, criteria) => deleteOne(table, criteria),
  find: (table, criteria) => find(table, criteria),

  deleteMany: (table, criteria) => deleteMany(table, criteria),
  count: (table, criteria) => count(table, criteria),
};
