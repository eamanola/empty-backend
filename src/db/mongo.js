const { MongoClient, ObjectId } = require('mongodb');

const { MONGO_URL } = require('../config');

let client;

const toMongoId = (doc) => {
  if (!doc) return doc;

  const { id, ...rest } = doc;
  if (!id) return { ...rest };

  return { _id: new ObjectId(id), ...rest };
};

const fromMongoId = (doc) => {
  if (!doc) return doc;

  const { _id: id, ...rest } = doc;
  if (!id) return { ...rest };

  return { id: String(id), ...rest };
};

const initDB = (url = MONGO_URL) => {
  client = new MongoClient(url);
};

const findOne = async (collection, where) => fromMongoId(
  await client
    .db()
    .collection(collection)
    .findOne(toMongoId(where)),
);

const insertOne = async (collection, doc) => {
  const { insertedId } = await client
    .db()
    .collection(collection)
    .insertOne(doc);

  return { id: String(insertedId) };
};

const replaceOne = (collection, where, replacement) => client
  .db()
  .collection(collection)
  .replaceOne(toMongoId(where), toMongoId(replacement));

const deleteOne = (collection, where) => client
  .db()
  .collection(collection)
  .deleteOne(toMongoId(where));

const find = (collection, where, { limit, offset }) => client
  .db()
  .collection(collection)
  .find(where, { limit, skip: offset })
  .map((doc) => fromMongoId(doc))
  .toArray();

const deleteMany = (collection, where) => client
  .db()
  .collection(collection)
  .deleteMany(where);

const count = (collection, where) => client
  .db()
  .collection(collection)
  .countDocuments(where);

module.exports = {
  initDB,
  connectDB: () => client.connect(),
  closeDB: () => client.close(),
  findOne,
  insertOne,
  replaceOne,
  deleteOne,
  find,
  deleteMany,
  count,
};
