const bcrypt = require('bcrypt');

const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
  count,
} = require('../db');

const { findOne, table } = require('../models/users');

const signup = require('./signup');
const login = require('./login');

jest.mock('../config', () => {
  const actual = jest.requireActual('../config');
  return {
    ...actual,
    SECRET: 'shhhhh',
  };
});

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
    await deleteMany(table);
  });

  it('should create a user', async () => {
    const email = 'foo@example.com';
    const password = '123';

    const before = await count(table);
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

    const after = await count(table);
    expect(await login({ email, password })).toBeTruthy();

    expect(before + 1).toBe(after);
  });

  it('should not allow dublicate emails', async () => {
    const email = 'foo@example.com';

    await signup({ email, password: '123' });

    const before = await count(table);
    try {
      await signup({ email, password: '123' });
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }

    const after = await count(table);

    expect(before).toBe(after);
  });

  it('should hash password', async () => {
    const email = 'foo@example.com';
    const password = '123';

    await signup({ email, password });

    const user = await findOne({ email });

    expect(user.password).toBe(undefined);
    expect(password).not.toBe(user.passwordHash);
    expect(await bcrypt.compare(password, user.passwordHash)).toBe(true);
  });
});
