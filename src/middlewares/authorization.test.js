const supertest = require('supertest');

const app = require('../app');

const {
  initDB,
  connectDB,
  closeDB,
} = require('../db');

const { deleteUsers } = require('../jest/test-helpers');

const { accessDenied } = require('../errors');

const authorization = require('./authorization');

jest.mock('../config', () => {
  const actual = jest.requireActual('../config');
  return {
    ...actual,
    SECRET: 'shhhhh',
  };
});

const api = supertest(app);

describe('authorization', () => {
  beforeAll(async () => {
    await initDB();
    await connectDB();
  });

  afterAll(closeDB);

  beforeEach(deleteUsers);

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

  it('should not add user, if token is missing', async () => {
    let error;
    const req = { get: (/* authorization */) => '' };
    const res = {};
    const next = (e) => { error = e; };

    expect(req.user).toBeFalsy();

    await authorization(req, res, next);

    expect(error).toBeFalsy();

    expect(req.user).toBeFalsy();
  });

  it('should not add user, if token is invalid bearer', async () => {
    let error;
    const req = { get: (/* authorization */) => 'bearer foo' };
    const res = {};
    const next = (e) => { error = e; };

    expect(req.user).toBeFalsy();

    await authorization(req, res, next);

    expect(error).toEqual(accessDenied);

    expect(req.user).toBeFalsy();
  });
});
