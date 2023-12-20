const { countUsers } = require('../jest/test-helpers');

const { decode: decodeToken } = require('../token');
const { accessDenied } = require('../errors');

const { findOne } = require('../models/users');

const signup = require('./signup');

const { login, userFromToken } = require('./login');

describe('login', () => {
  it('should return a token', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const token = await login({ email, password });

    expect(token).not.toEqual(expect.objectContaining({ email }));
    expect(await findOne(token)).toBe(null);

    expect(await findOne(decodeToken(token))).toEqual(expect.objectContaining({ email }));
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
});

describe('userFromToken', () => {
  it('should return a user', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const token = await login({ email, password });
    const user = await userFromToken(token);

    expect(user).toEqual(expect.objectContaining({ email }));
  });

  it('should not return passwordHash', async () => {
    const email = 'foo@example.com';
    const password = '123';
    await signup({ email, password });

    const token = await login({ email, password });
    const user = await userFromToken(token);

    expect(user).toEqual(expect.objectContaining({ email }));
    const userFromDB = await findOne({ email });

    expect(userFromDB).toEqual(expect.objectContaining(user));
    expect(userFromDB.passwordHash).toBeTruthy();
    expect(user.passwordHash).toBe(undefined);
  });

  it('should return falsy, if no token', async () => {
    const user = await userFromToken(null);

    expect(user).toBeFalsy();
  });

  it('should throw access denied, if token is invalid', async () => {
    try {
      const token = 'fakeToken';
      await userFromToken(token);
      expect(false).toBe(true);
    } catch ({ name }) {
      expect(name).toBe(accessDenied.name);
    }
  });
});
