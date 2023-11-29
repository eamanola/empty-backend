const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
  count,
  findOne,
  insertOne,
} = require('./mongo');

module.exports = {
  initDB,
  connectDB,
  closeDB,
  deleteMany: (table, criteria) => deleteMany(table, criteria),
  count: (table, criteria) => count(table, criteria),
  findOne: (table, criteria) => findOne(table, criteria),
  insertOne: (table, criteria) => insertOne(table, criteria),
};
