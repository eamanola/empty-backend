const { MongoMemoryServer } = require('mongodb-memory-server');

const { decode: decodeToken } = require('../token');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
  count,
} = require('../db');

const { table, findOne } = require('../models/users');

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

describe('login', () => {
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
    await deleteMany(table, {});
  });

  it('should return a token', async () => {
    const email = 'foo@example.com';
    const password = '123';

    await signup({ email, password });

    const { json } = await login({ email, password });
    const { token } = json;

    expect(token).toBeTruthy();
    expect(token).not.toEqual(expect.objectContaining({ email }));
    expect(await findOne(token)).toBe(null);

    expect(await findOne(decodeToken(token))).toEqual(expect.objectContaining({ email }));
  });

  it('should require existing user', async () => {
    const email = 'foo@example.com';
    const password = '123';

    expect(await count(table, { email })).toBe(0);

    try {
      await login({ email, password });
      expect(false).toBe(true);
    } catch (e) {
      expect(true).toBe(true);
    }
  });

  it('should require correct password', async () => {
    const email = 'foo@example.com';
    const password = '123';

    await signup({ email, password });

    try {
      await login({ email, password: 'foobar' });
      expect(false).toBe(true);
    } catch (e) {
      expect(true).toBe(true);
    }
  });
});
