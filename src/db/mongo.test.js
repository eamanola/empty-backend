const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
  count,
  insertOne,
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

  it('MongoClient should have used API', async () => {
    const client = new MongoClient('mongodb://foo');
    expect(typeof client.connect).toBe('function');
    expect(typeof client.close).toBe('function');
    expect(typeof client.db).toBe('function');
    expect(typeof client.db().collection).toBe('function');
    expect(typeof client.db().collection('collection').deleteMany).toBe('function');
    expect(typeof client.db().collection('collection').insertOne).toBe('function');
    expect(typeof client.db().collection('collection').countDocuments).toBe('function');
    expect(typeof client.db().collection('collection').findOne).toBe('function');
  });

  describe('connectDB', () => {
    it('should connect', async () => {
      await connectDB();

      await deleteMany('collection', {});
      expect(await count('collection')).toBe(0);
      await insertOne('collection', { foo: 'bar' });
      expect(await count('collection')).toBe(1);

      await closeDB();
    });
  });

  describe('connectDB', () => {
    it('should disconnect', async () => {
      await connectDB();

      await deleteMany('collection', {});
      expect(await count('collection')).toBe(0);

      await closeDB();

      count('collection')
        .catch(({ name }) => expect(name).toMatch('MongoNotConnectedError'));
    });
  });
});
