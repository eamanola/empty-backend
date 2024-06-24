const supertest = require('supertest');

const { deleteUsers } = require('../../jest/test-helpers');

const { create: signup, authorize: userFromToken } = require('../controllers');

const userErrors = require('../errors');

const app = require('../../../app');

const api = supertest(app);

describe('/login', () => {
  beforeEach(deleteUsers);

  it('should return 200 OK with a token', async () => {
    const email = 'foo@example.com';
    const credentials = { email, password: '123' };
    await signup(credentials);

    const response = await api.post('/login').send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('OK');
    expect(await userFromToken(response.body.token))
      .toEqual(expect.objectContaining({ email }));
  });

  it('should throw userNotFoundError, if user doesn exist', async () => {
    const { userNotFoundError } = userErrors;
    const credentials = { email: 'foo@example.com', password: '123' };

    const response = await api.post('/login').send(credentials);

    expect(response.status).toBe(userNotFoundError.status);
    expect(response.body.message).toBe(userNotFoundError.message);
  });

  it('should throw invalidPasswordError, if wrong password', async () => {
    const { invalidPasswordError } = userErrors;
    const credentials = { email: 'foo@example.com', password: '123' };
    await signup(credentials);

    const response = await api.post('/login').send({
      ...credentials,
      password: 'foo',
    });

    expect(response.status).toBe(invalidPasswordError.status);
    expect(response.body.message).toBe(invalidPasswordError.message);
  });

  it('should throw paramError, on invalid params', async () => {
    const { paramError } = userErrors;
    const credentials = { email: 'foo@example.com', password: '123' };
    await signup(credentials);

    expect((await api.post('/login').send({ email: 'foo', password: '123' })).status)
      .toBe(paramError.status);
    expect((await api.post('/login').send({ password: '123' })).status)
      .toBe(paramError.status);
    expect((await api.post('/login').send({ email: 'foo@example.com' })).status)
      .toBe(paramError.status);
  });
});
