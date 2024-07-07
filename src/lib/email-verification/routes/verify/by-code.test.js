const supertest = require('supertest');

const { deleteAll, getToken, isVerified } = require('../../jest/test-helpers');

const { app } = require('../../..');
const { findOne } = require('../../model');

const api = supertest(app);

describe('by-code', () => {
  afterEach(deleteAll);

  it('should verify email', async () => {
    const { token, email } = await getToken(api, { email: 'foo@example.com' });

    const { code } = await findOne(email);
    expect(await isVerified(email)).toBe(false);
    expect(code).toEqual(expect.any(Number));

    await api.patch('/email-verification')
      .set({ Authorization: `bearer ${token}` })
      .send({ code });

    expect(await isVerified(email)).toBe(true);
  });

  it('should fail if wrong code', async () => {
    const { token, email } = await getToken(api, { email: 'bar@example.com' });

    const wrongCode = 2000;
    const { code } = await findOne(email);
    expect(wrongCode).not.toBe(code);

    await api.patch('/email-verification')
      .set({ Authorization: `bearer ${token}` })
      .send({ code: wrongCode });

    expect(await isVerified(email)).toBe(false);
  });
});
