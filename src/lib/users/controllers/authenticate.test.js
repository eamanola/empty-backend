const { countUsers, deleteUsers, setEmailStatus } = require('../../jest/test-helpers');

const { create: signup, authorize: userFromToken } = require('.');

const authenticate = require('./authenticate');

describe('authenticate', () => {
  afterEach(deleteUsers);

  it('should return a token', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const { token } = await authenticate({ email, password });

    expect(token).toBeTruthy();
    expect(token).not.toEqual(expect.objectContaining({ email }));
    expect(await userFromToken(token)).toEqual(expect.objectContaining({ email }));
  });

  it('should return emailVerified', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const { emailVerified, token } = await authenticate({ email, password });
    expect(emailVerified).toBe(false);

    await userFromToken(token);
    await setEmailStatus({ email, verified: true });
    const { emailVerified: emailVerifiedUpdated } = await authenticate({ email, password });
    expect(emailVerifiedUpdated).toBe(true);
  });

  it('should require existing user', async () => {
    const email = 'foo@example.com';
    const password = '123';

    expect(await countUsers({ email })).toBe(0);

    try {
      await authenticate({ email, password });
      expect('Should not reach').toBe(true);
    } catch ({ message }) {
      expect(/not found/u.test(message)).toBe(true);
    }
  });

  it('should require correct password', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    try {
      await authenticate({ email, password: 'foobar' });
      expect('Should not reach').toBe(true);
    } catch ({ message }) {
      expect(/Login failed/u.test(message)).toBe(true);
    }
  });

  it('should accept optional require verified email', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });
    const { token } = await authenticate({ email, password }, { REQUIRE_VERIFIED_EMAIL: false });

    const user = await userFromToken(token);
    expect(user.emailVerified).toBe(false);

    try {
      await authenticate({ email, password }, { REQUIRE_VERIFIED_EMAIL: true });
      expect('Should not reach').toBe(true);
    } catch ({ message }) {
      expect(/Email Not Verified/u.test(message)).toBe(true);
    }
  });
});
