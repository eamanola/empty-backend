const supertest = require('supertest');

const app = require('./app');

describe('automata-app', () => {
  it('should start', async () => {
    const api = supertest(app);

    const { status } = await api.get('/health');
    expect(status).toBe(200);
  });

  it('should create and authenticate users', async () => {
    const api = supertest(app);

    const credendials = { email: `foo${Math.random()}@example.com`, password: 'bar' };
    const { status: signupStatus } = await api.post('/signup').send(credendials);
    expect(signupStatus).toBe(201);

    const { status, body } = await api.post('/login').send(credendials);
    expect(status).toBe(200);
    expect(body.token).toBeTruthy();
  });
});
