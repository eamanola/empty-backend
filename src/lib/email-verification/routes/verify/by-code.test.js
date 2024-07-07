const supertest = require('supertest');
const { deleteAll } = require('automata-db');

const { deleteUsers, getToken } = require('../../../jest/test-helpers');

const { app } = require('../../..');
const { findOne } = require('../../model');
const { name: tableName } = require('../../model/table');
const { isVerified } = require('../../controllers/set-status');

const api = supertest(app);

describe('by-code', () => {
  afterEach(async () => {
    await deleteUsers();
    await deleteAll(tableName);
  });

  it('should verify email', async () => {
    const { token, user } = await getToken();

    const { code } = await findOne(user.email);
    expect(await isVerified(user.email)).toBe(false);
    expect(code).toEqual(expect.any(Number));

    await api.patch('/email-verification')
      .set({ Authorization: `bearer ${token}` })
      .send({ code });

    expect(await isVerified(user.email)).toBe(true);
  });

  it('should fail if wrong code', async () => {
    const { token, user } = await getToken();

    const wrongCode = 2000;
    const { code } = await findOne(user.email);
    expect(wrongCode).not.toBe(code);

    await api.patch('/email-verification')
      .set({ Authorization: `bearer ${token}` })
      .send({ code: wrongCode });

    expect(await isVerified(user.email)).toBe(false);
  });
});
