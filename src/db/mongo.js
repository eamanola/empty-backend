const { MongoClient } = require('mongodb');

const { MONGO_URL } = require('../config');

let client;

const initDB = (url = MONGO_URL) => {
  client = new MongoClient(url);
};

const deleteMany = (collection, criteria) => client
  .db()
  .collection(collection)
  .deleteMany(criteria);

const count = (collection, criteria) => client
  .db()
  .collection(collection)
  .countDocuments(criteria);

const findOne = (collection, criteria) => client
  .db()
  .collection(collection)
  .findOne(criteria);

const insertOne = (collection, criteria) => client
  .db()
  .collection(collection)
  .insertOne(criteria);

module.exports = {
  initDB,
  connectDB: () => client.connect(),
  closeDB: () => client.close(),
  deleteMany,
  count,
  findOne,
  insertOne,
};
