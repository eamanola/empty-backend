const { MongoClient, ObjectId } = require('mongodb');

const { MONGO_URL } = require('../config');

let client;

const toMongoId = (doc) => {
  if (!doc) return doc;

  const { id, ...rest } = doc;
  if (!id) return { ...rest };

  return { _id: new ObjectId(id), ...rest };
};

const fromMongoId = (obj) => {
  if (!obj) return obj;

  const { _id: id, ...rest } = obj;
  if (!id) return { ...rest };

  return { id: String(id), ...rest };
};

const initDB = (url = MONGO_URL) => {
  client = new MongoClient(url);
};

const findOne = async (collection, criteria) => fromMongoId(
  await client
    .db()
    .collection(collection)
    .findOne(toMongoId(criteria)),
);

const insertOne = (collection, criteria) => client
  .db()
  .collection(collection)
  .insertOne(criteria);

const replaceOne = (collection, criteria, replacement) => client
  .db()
  .collection(collection)
  .replaceOne(toMongoId(criteria), toMongoId(replacement));

const deleteOne = (collection, criteria) => client
  .db()
  .collection(collection)
  .deleteOne(toMongoId(criteria));

const find = (collection, criteria) => client
  .db()
  .collection(collection)
  .find(criteria)
  .map((doc) => fromMongoId(doc))
  .toArray();

const deleteMany = (collection, criteria) => client
  .db()
  .collection(collection)
  .deleteMany(criteria);

const count = (collection, criteria) => client
  .db()
  .collection(collection)
  .countDocuments(criteria);

module.exports = {
  initDB,
  connectDB: () => client.connect(),
  closeDB: () => client.close(),
  findOne,
  insertOne,
  replaceOne,
  deleteOne,
  find,

  /* only for test */
  deleteMany,
  count,
};
