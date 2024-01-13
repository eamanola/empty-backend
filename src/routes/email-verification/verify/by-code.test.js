const supertest = require('supertest');

const { getToken, findUser, deleteUsers } = require('../../../jest/test-helpers');

const app = require('../../../app');

const api = supertest(app);

describe('by-code', () => {
  beforeEach(deleteUsers);

  it('should verify email', async () => {
    const { token, user } = await getToken();

    expect(user.emailVerified).toBe(false);

    await api.patch('/email-verification/by-code')
      .set({ Authorization: `bearer ${token}` })
      .send({ code: user.emailVerificationCode });

    const updatedUser = await findUser({ id: user.id });
    expect(updatedUser.emailVerified).toBe(true);
  });

  it('should fail if wrong code', async () => {
    const { token, user } = await getToken();

    const wrongCode = 2000;
    expect(wrongCode).not.toBe(user.emailVerificationCode);

    await api.patch('/email-verification/by-code')
      .set({ Authorization: `bearer ${token}` })
      .send({ code: wrongCode });

    const updatedUser = await findUser({ id: user.id });
    expect(updatedUser.emailVerified).toBe(false);
  });
});
