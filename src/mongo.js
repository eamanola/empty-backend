const { MongoClient } = require('mongodb');

// Connection URL
const url = process.env.MONGO_URL;
const client = new MongoClient(url);

module.exports = {
  connectDB: () => client.connect(),
  closeDB: () => client.close(),
};
