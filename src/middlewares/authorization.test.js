const supertest = require('supertest');

const {
  startTestDB,
  stopTestDB,
  deleteUsers,
} = require('../test-helper.test');
const app = require('../app');

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
  beforeAll(startTestDB);

  afterAll(stopTestDB);

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
