const { accessDenied } = require('../../errors');

const { findOne } = require('../../models/users');

const { signup, login, fromToken } = require('.');

describe('fromToken', () => {
  it('should return a user', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const token = await login({ email, password });
    const user = await fromToken(token);

    expect(user).toEqual(expect.objectContaining({ email }));
  });

  it('should not return passwordHash', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const token = await login({ email, password });
    const user = await fromToken(token);

    expect(user).toEqual(expect.objectContaining({ email }));
    const userFromDB = await findOne({ email });

    expect(userFromDB).toEqual(expect.objectContaining(user));
    expect(userFromDB.passwordHash).toBeTruthy();
    expect(user.passwordHash).toBe(undefined);
  });

  it('should return falsy, if no token', async () => {
    const user = await fromToken(null);

    expect(user).toBeFalsy();
  });

  it('should throw access denied, if token is invalid', async () => {
    try {
      const token = 'fakeToken';
      await fromToken(token);
      expect(false).toBe(true);
    } catch ({ name }) {
      expect(name).toBe(accessDenied.name);
    }
  });
});
