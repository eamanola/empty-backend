const { countUsers, deleteUsers } = require('../../jest/test-helpers');

const { signup, login, fromToken } = require('.');

describe('login', () => {
  beforeEach(deleteUsers);

  it('should return a token', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const token = await login({ email, password });

    expect(token).toBeTruthy();
    expect(token).not.toEqual(expect.objectContaining({ email }));
    expect(await fromToken(token)).toEqual(expect.objectContaining({ email }));
  });

  it('should require existing user', async () => {
    const email = 'foo@example.com';
    const password = '123';

    expect(await countUsers({ email })).toBe(0);

    try {
      await login({ email, password });
      expect('Should not reach').toBe(true);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('should require correct password', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    try {
      await login({ email, password: 'foobar' });
      expect('Should not reach').toBe(true);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('should accept optional require verified email', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });
    const token = await login({ email, password }, { REQUIRE_VERIFIED_EMAIL: false });

    const user = await fromToken(token);
    expect(user.emailVerified).toBe(false);

    try {
      await login({ email, password }, { REQUIRE_VERIFIED_EMAIL: true });
      expect('Should not reach').toBe(true);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});
