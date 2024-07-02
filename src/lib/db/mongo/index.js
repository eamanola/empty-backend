const { MongoClient } = require('mongodb');

const { MONGO_URL } = require('../../../config');

let client;
// https://www.mongodb.com/docs/manual/core/indexes/create-index/specify-index-name/#std-label-specify-index-name
const copyDoc = (doc) => {
  if (!doc) return doc;

  return { ...doc };
};

const removeMongoId = (doc) => {
  if (!doc) return doc;

  const { _id, ...rest } = doc;
  return { ...rest };
};

const initDB = (url = MONGO_URL) => {
  client = new MongoClient(url);
};

const findOne = async (collection, filter) => removeMongoId(
  await client
    .db()
    .collection(collection)
    .findOne(copyDoc(filter)),
);

const insertOne = async (collection, doc) => client
  .db()
  .collection(collection)
  .insertOne(copyDoc(doc));

const replaceOne = (collection, filter, replacement) => client
  .db()
  .collection(collection)
  .replaceOne(copyDoc(filter), copyDoc(replacement));

const deleteOne = (collection, filter) => client
  .db()
  .collection(collection)
  .deleteOne(copyDoc(filter));

const find = (collection, filter, { limit = 0, offset = 0 }) => client
  .db()
  .collection(collection)
  .find(copyDoc(filter), { limit, skip: offset })
  .map((doc) => removeMongoId(doc))
  .toArray();

const updateOne = (collection, filter, updates, options) => client
  .db()
  .collection(collection)
  .updateOne(copyDoc(filter), { $set: updates }, options);

// const upsert = (collection, filter, updates) => (
//  updateOne(collection, filter, updates, { upsert: true })
// );

const deleteAll = (collection, filter) => client
  .db()
  .collection(collection)
  .deleteMany(copyDoc(filter));

const count = (collection, filter) => client
  .db()
  .collection(collection)
  .countDocuments(copyDoc(filter));

const createTable = () => null;
const dropTable = () => null;

module.exports = {
  closeDB: () => client.close(),
  connectDB: () => client.connect(),
  count,
  createTable,
  deleteAll,
  deleteOne,
  dropTable,
  find,
  findOne,
  hasClient: () => !!client,
  initDB,
  insertOne,
  replaceOne,
  updateOne,
  // upsert,
};
