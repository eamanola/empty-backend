const { MONGO_URL } = require('../../config');

if (MONGO_URL === 'use-memory-server') {
  jest.mock('../db/mongo', () => {
    const { MongoMemoryServer } = jest.requireActual('mongodb-memory-server');
    const mongo = jest.requireActual('../db/mongo');
    let mongod;

    const initDB = async () => {
      mongod = await MongoMemoryServer.create();
      return mongo.initDB(mongod.getUri());
    };

    const closeDB = async () => {
      await mongo.closeDB();
      await mongod.stop();
    };

    return {
      ...mongo,
      closeDB,
      initDB,
    };
  });
}
