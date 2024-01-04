const supertest = require('supertest');

const { APIgetToken } = require('../../../jest/test-helpers');
const userFromToken = require('../../../controllers/users/from-token');

const { findOne } = require('../../../models/users');

const app = require('../../../app');

const api = supertest(app);

describe('by-code', () => {
  it('should verify email', async () => {
    const token = await APIgetToken({ api });
    const user = await userFromToken(token);

    expect(user.emailVerified).toBe(false);

    await api.post('/email-verification/by-code')
      .set({ Authorization: `bearer ${token}` })
      .send({ code: user.emailVerificationCode });

    const updatedUser = await findOne({ id: user.id });
    expect(updatedUser.emailVerified).toBe(true);
  });

  it('should fail if wrong code', async () => {
    const token = await APIgetToken({ api });
    const user = await userFromToken(token);

    const wrongCode = 2000;
    expect(wrongCode).not.toBe(user.emailVerificationCode);

    await api.post('/email-verification/by-code')
      .set({ Authorization: `bearer ${token}` })
      .send({ code: wrongCode });

    const updatedUser = await findOne({ id: user.id });
    expect(updatedUser.emailVerified).toBe(false);
  });
});
