const bcrypt = require('bcrypt');

const {
  startTestDB,
  stopTestDB,
  deleteUsers,
  countUsers,
} = require('../test-helper.test');

const { findOne } = require('../models/users');

const signup = require('./signup');

const login = require('./login');

jest.mock('../config', () => {
  const actual = jest.requireActual('../config');
  return {
    ...actual,
    SECRET: 'shhhhh',
  };
});

describe('signup', () => {
  beforeAll(startTestDB);

  afterAll(stopTestDB);

  beforeEach(deleteUsers);

  it('should create a user', async () => {
    const email = 'foo@example.com';
    const password = '123';

    expect(await countUsers()).toBe(0);
    try {
      await login({ email, password });
      expect('Should not reach').toBe(true);
    } catch (e) {
      expect(e).toBeTruthy();
    }

    await signup({
      email,
      password,
    });

    expect(await countUsers()).toBe(1);
    expect(await login({ email, password })).toBeTruthy();
  });

  it('should not allow dublicate emails', async () => {
    const email = 'foo@example.com';

    await signup({ email, password: '123' });
    expect(await countUsers()).toBe(1);

    try {
      await signup({ email, password: '123' });
      expect('Should not reach').toBe(true);
    } catch (e) {
      expect(e).toBeTruthy();
    } finally {
      expect(await countUsers()).toBe(1);
    }
  });

  it('should hash password', async () => {
    const email = 'foo@example.com';
    const password = '123';

    await signup({ email, password });

    const user = await findOne({ email });

    expect(user.password).toBe(undefined);
    expect(password).not.toBe(user.passwordHash);
    expect(await bcrypt.compare(password, user.passwordHash)).toBe(true);
  });
});
