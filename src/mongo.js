const { MongoClient } = require('mongodb');

let client;

const initDB = (url = process.env.MONGO_URL) => {
  client = new MongoClient(url);

  return client;
};

module.exports = {
  initDB,
  connectDB: () => client.connect(),
  closeDB: () => client.close(),
};
