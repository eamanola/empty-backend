const { MongoClient } = require('mongodb');

let client;

const init = (url) => {
  client = new MongoClient(url);

  return client;
};

module.exports = {
  initDB: (url = process.env.MONGO_URL) => init(url),
  connectDB: () => client.connect(),
  closeDB: () => client.close(),
};
