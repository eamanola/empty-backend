const { MongoClient } = require('mongodb');

const { MONGO_URL } = require('./config');

let client;

const initDB = (url = MONGO_URL) => {
  client = new MongoClient(url);

  return client;
};

module.exports = {
  initDB,
  connectDB: () => client.connect(),
  closeDB: () => client.close(),
};
