const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
  count,
} = require('../db');

const app = require('../app');
const { table, findOne } = require('../models/users');
const {
  emailTakenError,
  paramError,
} = require('../errors');

const api = supertest(app);

let mongod;

describe('/signup', () => {
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

  it('should return 201 OK', async () => {
    const credentials = {
      email: 'foo@example.com',
      password: '123',
    };

    const response = await api.post('/signup').send(credentials);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('OK');
    expect(await findOne({ email: credentials.email })).toBeTruthy();
  });

  it('should throw emailTakenError, on dublicate', async () => {
    const credentials = {
      email: 'foo@example.com',
      password: '123',
    };

    await api.post('/signup').send(credentials);

    const response = await api.post('/signup').send(credentials);

    expect(response.status).toBe(emailTakenError.status);
    expect(response.body.message).toBe(emailTakenError.message);
    expect(await count(table)).toBe(1);
  });

  it('should throw paramError, on invalid params', async () => {
    expect((await api.post('/signup').send({ email: 'foo', password: '123' })).status)
      .toBe(paramError.status);
    expect((await api.post('/signup').send({ password: '123' })).status)
      .toBe(paramError.status);
    expect((await api.post('/signup').send({ email: 'foo@example.com' })).status)
      .toBe(paramError.status);
    expect(await count(table)).toBe(0);
  });
});
