const { DB_ENGINE, DB_URL } = require('../src/config');

if (DB_ENGINE === 'mongo') {
  if (DB_URL === ':memory:') {
    jest.mock('automata-db', () => {
      const { MongoMemoryServer } = jest.requireActual('mongodb-memory-server');
      const db = jest.requireActual('automata-db');
      let mongod;

      const initDB = async () => {
        mongod = await MongoMemoryServer.create();
        return db.initDB(mongod.getUri());
      };

      const closeDB = async () => {
        await db.closeDB();
        await mongod.stop();
      };

      return {
        ...db,
        closeDB,
        initDB,
      };
    });
  }
}
