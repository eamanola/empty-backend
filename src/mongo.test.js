const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  initDB,
  connectDB,
  closeDB,
} = require('./mongo');

let mongod;

describe('connection', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    initDB(uri);
  });

  afterAll(async () => {
    await closeDB();
    await mongod.stop();
  });

  it('should connect', async () => {
    try {
      const client = await connectDB();
      expect(typeof client.db).toBe('function');

      const collection = client.db().collection('collection');
      await collection.deleteMany({});
      expect(await collection.countDocuments()).toBe(0);

      await collection.insertOne({ foo: 'bar' });
      expect(await collection.countDocuments()).toBe(1);
    } catch (e) {
      expect('error').toBe('not good');
    }
  });

  it('should disconnect', async () => {
    try {
      const client = await connectDB();

      const collection = client.db().collection('collection');
      await collection.deleteMany({});
      expect(await collection.countDocuments()).toBe(0);

      await closeDB();
      await collection.countDocuments();
    } catch ({ name }) {
      expect(name).toBe('MongoNotConnectedError');
    }
  });
});
