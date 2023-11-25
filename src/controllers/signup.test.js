const bcrypt = require('bcrypt');

const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  initDB,
  connectDB,
  closeDB,
  DB,
} = require('../mongo');

const { signup, table } = require('./signup');
const { login } = require('./login');

jest.mock('../config', () => ({ SECRET: 'shhhhh' }));

let mongod;

describe('signup', () => {
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

  it('should create a user', async () => {
    const collection = DB().collection(table);
    const email = 'foo@example.com';
    const password = '123';

    const before = await collection.countDocuments();
    try {
      await login({ email, password });
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }

    await signup({
      email,
      password,
    });

    const after = await collection.countDocuments();
    expect(await login({ email, password })).toBeTruthy();

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
