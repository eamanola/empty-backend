const {
  startTestDB,
  stopTestDB,
  deleteUsers,
  countUsers,
} = require('../test-helper.test');

const { decode: decodeToken } = require('../token');

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

describe('login', () => {
  beforeAll(startTestDB);

  afterAll(stopTestDB);

  beforeEach(deleteUsers);

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
