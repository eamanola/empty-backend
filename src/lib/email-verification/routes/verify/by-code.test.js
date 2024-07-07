const express = require('express');
const supertest = require('supertest');

const { createUser, deleteAll, isVerified } = require('../../jest/test-helpers');

const { findOne } = require('../../model');
const router = require('../../router');

const app = express();
app.use(express.json());

const email = 'foo@example.com';
app.use((req, res, next) => { req.user = { email }; next(); });

app.use('/email-verification', router);
const api = supertest(app);

describe('by-code', () => {
  afterEach(deleteAll);

  it('should verify email', async () => {
    await createUser({ email });

    const { code } = await findOne(email);
    expect(await isVerified(email)).toBe(false);
    expect(code).toEqual(expect.any(Number));

    await api.patch('/email-verification').send({ code });

    expect(await isVerified(email)).toBe(true);
  });

  it('should fail if wrong code', async () => {
    await createUser({ email });

    const wrongCode = 2000;
    const { code } = await findOne(email);
    expect(wrongCode).not.toBe(code);

    await api.patch('/email-verification').send({ code: wrongCode });

    expect(await isVerified(email)).toBe(false);
  });
});
