const bcrypt = require('bcrypt');

const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  initDB,
  connectDB,
  closeDB,
  DB,
} = require('../mongo');

const { signup, table } = require('./signup');

let mongod;

describe('connection', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    initDB(uri);
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
    await mongod.stop();
  });

  beforeEach(async () => {
    const collection = DB().collection(table);
    await collection.deleteMany({});
  });

  it('should create a new document', async () => {
    const collection = DB().collection(table);
    const before = await collection.countDocuments();

    await signup({
      email: 'foo@example.com',
      password: '123',
    });

    const after = await collection.countDocuments();

    expect(before + 1).toBe(after);
  });

  it('should not allow dublicate emails', async () => {
    const collection = DB().collection(table);
    const email = 'foo@example.com';

    await signup({ email, password: '123' });

    const before = await collection.countDocuments();
    try {
      await signup({ email, password: '123' });
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }

    const after = await collection.countDocuments();

    expect(before).toBe(after);
  });

  it('should hash password', async () => {
    const collection = DB().collection(table);

    const email = 'foo@example.com';
    const password = '123';

    await signup({ email, password });

    const user = await collection.findOne({ email });

    expect(user.password).toBe(undefined);
    expect(password).not.toBe(user.passwordHash);
    expect(await bcrypt.compare(password, user.passwordHash)).toBe(true);
  });
});
