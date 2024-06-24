const supertest = require('supertest');

const { countUsers, deleteUsers, findUser } = require('../../jest/test-helpers');

const userErrors = require('../errors');

const app = require('../../app');

const api = supertest(app);

describe('/signup', () => {
  beforeEach(deleteUsers);

  it('should return 201 OK', async () => {
    const credentials = { email: 'foo@example.com', password: '123' };

    const response = await api.post('/signup').send(credentials);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('OK');
    expect(await findUser({ email: credentials.email })).toBeTruthy();
  });

  it('should throw emailTakenError, on dublicate', async () => {
    const { emailTakenError } = userErrors;
    const credentials = { email: 'foo@example.com', password: '123' };

    await api.post('/signup').send(credentials);

    const response = await api.post('/signup').send(credentials);

    expect(response.status).toBe(emailTakenError.status);
    expect(response.body.message).toBe(emailTakenError.message);
    expect(await countUsers()).toBe(1);
  });

  it('should throw paramError, on invalid params', async () => {
    const { paramError } = userErrors;

    expect((await api.post('/signup').send({ email: 'foo', password: '123' })).status)
      .toBe(paramError.status);
    expect((await api.post('/signup').send({ password: '123' })).status)
      .toBe(paramError.status);
    expect((await api.post('/signup').send({ email: 'foo@example.com' })).status)
      .toBe(paramError.status);
    expect(await countUsers()).toBe(0);
  });
});
