const { MongoClient, ObjectId } = require('mongodb');

const { MONGO_URL } = require('../../config');

let client;

const toMongoId = (doc) => {
  if (!doc) return doc;

  const { id, ...rest } = doc;
  if (!id) return { ...rest };

  return { _id: ObjectId.createFromHexString(id), ...rest };
};

const fromMongoId = (doc) => {
  if (!doc) return doc;

  const { _id, ...rest } = doc;
  if (!_id) return { ...rest };

  return { id: _id.toHexString(), ...rest };
};

const initDB = (url = MONGO_URL) => {
  client = new MongoClient(url);
};

const findOne = async (collection, filter) => fromMongoId(
  await client
    .db()
    .collection(collection)
    .findOne(toMongoId(filter)),
);

const insertOne = async (collection, doc) => {
  const { insertedId } = await client
    .db()
    .collection(collection)
    .insertOne(toMongoId(doc));

  return fromMongoId({ _id: insertedId });
};

const replaceOne = (collection, filter, replacement) => client
  .db()
  .collection(collection)
  .replaceOne(toMongoId(filter), toMongoId(replacement));

const deleteOne = (collection, filter) => client
  .db()
  .collection(collection)
  .deleteOne(toMongoId(filter));

const find = (collection, filter, { limit, offset }) => client
  .db()
  .collection(collection)
  .find(filter, { limit, skip: offset })
  .map((doc) => fromMongoId(doc))
  .toArray();

const updateOne = (collection, filter, updates, options = {}) => client
  .db()
  .collection(collection)
  .updateOne(toMongoId(filter), { $set: updates }, options);

// const upsert = (collection, filter, updates) => (
//  updateOne(collection, filter, updates, { upsert: true })
// );

const deleteAll = (collection, filter) => client
  .db()
  .collection(collection)
  .deleteMany(filter);

const count = (collection, filter) => client
  .db()
  .collection(collection)
  .countDocuments(filter);

module.exports = {
  closeDB: () => client.close(),
  connectDB: () => client.connect(),
  count,
  deleteAll,
  deleteOne,
  find,
  findOne,
  initDB,
  insertOne,
  replaceOne,
  updateOne,
  // upsert,
};
