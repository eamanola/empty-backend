const {
  deleteUsers,
  findUser,
  updateUser,
  signup,
  login,
  errors,
} = require('../../jest/test-helpers');

const authorize = require('./authorize');

describe('authorize', () => {
  beforeEach(deleteUsers);

  it('should return a user', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const token = await login({ email, password });
    const user = await authorize(token);

    expect(user).toEqual(expect.objectContaining({ email }));
  });

  it('should not return passwordHash', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const token = await login({ email, password });
    const user = await authorize(token);

    expect(user).toEqual(expect.objectContaining({ email }));
    const userFromDB = await findUser({ email });

    expect(userFromDB).toEqual(expect.objectContaining(user));
    expect(userFromDB.passwordHash).toBeTruthy();
    expect(user.passwordHash).toBe(undefined);
  });

  it('should return falsy, if no token', async () => {
    const user = await authorize(null);

    expect(user).toBeFalsy();
  });

  it('should throw access denied, if token is invalid', async () => {
    const { accessDenied } = errors;

    try {
      const token = 'fakeToken';
      await authorize(token);
      expect(false).toBe(true);
    } catch ({ name }) {
      expect(name).toBe(accessDenied.name);
    }
  });

  it('should throw sessionExpired, if password changed', async () => {
    const { sessionExipred } = errors;
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });
    const token = await login({ email, password });

    await updateUser({ email }, { passwordHash: 'a new hash' });

    try {
      await authorize(token);
      expect(false).toBe(true);
    } catch ({ name }) {
      expect(name).toBe(sessionExipred.name);
    }
  });

  it('should throw sessionExpired, if email changed', async () => {
    const { sessionExipred } = errors;
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });
    const token = await login({ email, password });

    await updateUser({ email }, { email: 'bar@example.com' });

    try {
      await authorize(token);
      expect(false).toBe(true);
    } catch ({ name }) {
      expect(name).toBe(sessionExipred.name);
    }
  });
});
