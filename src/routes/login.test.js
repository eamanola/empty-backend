const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
} = require('../db');
const app = require('../app');
const { table, findOne } = require('../models/users');
const { decode: decodeToken } = require('../token');
const {
  userNotFoundError,
  invalidPasswordError,
  validationError,
} = require('../errors');

jest.mock('../config', () => {
  const actual = jest.requireActual('../config');
  return {
    ...actual,
    SECRET: 'shhhhh',
  };
});

const api = supertest(app);

let mongod;

describe('/login', () => {
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

  it('should return 200 OK with a token', async () => {
    const email = 'foo@example.com';
    const credentials = {
      email,
      password: '123',
    };
    await api.post('/signup').send(credentials);

    const response = await api.post('/login').send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('OK');
    expect(await findOne(decodeToken(response.body.token)))
      .toEqual(expect.objectContaining({ email }));
  });

  it('should throw userNotFoundError, if user doesn exist', async () => {
    const credentials = {
      email: 'foo@example.com',
      password: '123',
    };

    const response = await api.post('/login').send(credentials);

    expect(response.status).toBe(userNotFoundError.status);
    expect(response.body.message).toBe(userNotFoundError.message);
  });

  it('should throw invalidPasswordError, if wrong password', async () => {
    const credentials = {
      email: 'foo@example.com',
      password: '123',
    };
    await api.post('/signup').send(credentials);

    const response = await api.post('/login').send({
      ...credentials,
      password: 'foo',
    });

    expect(response.status).toBe(invalidPasswordError.status);
    expect(response.body.message).toBe(invalidPasswordError.message);
  });

  it('should throw ValidationError, on invalid params', async () => {
    const credentials = {
      email: 'foo@example.com',
      password: '123',
    };
    await api.post('/signup').send(credentials);

    expect((await api.post('/login').send({ email: 'foo', password: '123' })).status)
      .toBe(validationError.status);
    expect((await api.post('/login').send({ password: '123' })).status)
      .toBe(validationError.status);
    expect((await api.post('/login').send({ email: 'foo@example.com' })).status)
      .toBe(validationError.status);
  });
});
