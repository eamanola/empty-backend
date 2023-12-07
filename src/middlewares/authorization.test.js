const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
} = require('../db');
const app = require('../app');
const { table } = require('../models/users');

const authorization = require('./authorization');

jest.mock('../config', () => {
  const actual = jest.requireActual('../config');
  return {
    ...actual,
    SECRET: 'shhhhh',
  };
});

const api = supertest(app);

let mongod;

describe('authorization', () => {
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

  beforeEach(() => deleteMany(table));

  it('should add user to request', async () => {
    const email = 'foo@example.com';
    const credentials = { email, password: '123' };
    await api.post('/signup').send(credentials);
    const { token } = (await api.post('/login').send(credentials)).body;

    const req = { get: (/* authorization */) => `bearer ${token}` };
    const res = {};
    const next = () => {};

    expect(req.user).toBeFalsy();

    await authorization(req, res, next);

    expect(req.user)
      .toEqual(expect.objectContaining({ email }));
  });

  it('should not add user, if token is invalid', async () => {
    const req = { get: (/* authorization */) => 'foo' };
    const res = {};
    const next = () => {};

    expect(req.user).toBeFalsy();

    await authorization(req, res, next);

    expect(req.user).toBeFalsy();
  });

  it('should not add user, if token is invalid bearer', async () => {
    const req = { get: (/* authorization */) => 'bearer foo' };
    const res = {};
    const next = () => {};

    expect(req.user).toBeFalsy();

    await authorization(req, res, next);

    expect(req.user).toBeFalsy();
  });
});
