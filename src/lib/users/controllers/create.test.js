const bcrypt = require('bcrypt');

const {
  countUsers, deleteUsers, findUser, isEmailVerified,
} = require('../../jest/test-helpers');

const { authenticate: login } = require('.');

const create = require('./create');

describe('signup', () => {
  afterEach(deleteUsers);

  it('should create a user', async () => {
    const email = 'foo@example.com';
    const password = '123';

    expect(await countUsers()).toBe(0);

    try {
      await login({ email, password });
      expect('Should not reach').toBe(true);
    } catch (err) {
      expect(err).toBeTruthy();
    }

    await create({ email, password });

    expect(await countUsers()).toBe(1);
    expect(await login({ email, password })).toBeTruthy();
  });

  it('should not allow dublicate emails', async () => {
    const email = 'foo@example.com';
    await create({ email, password: '123' });

    expect(await countUsers()).toBe(1);

    try {
      await create({ email, password: '123' });
      expect('Should not reach').toBe(true);
    } catch ({ message }) {
      expect(/Email already in use/u.test(message)).toBe(true);
    }

    expect(await countUsers()).toBe(1);
  });

  it('should hash password', async () => {
    const email = 'foo@example.com';
    const password = '123';

    await create({ email, password });

    const user = await findUser({ email });

    expect(user.password).toBe(undefined);
    expect(password).not.toBe(user.passwordHash);
    expect(await bcrypt.compare(password, user.passwordHash)).toBe(true);
  });

  it('should set email unverified', async () => {
    const email = 'foo@example.com';
    const password = '123';

    await create({ email, password });

    expect(await isEmailVerified(email)).toBe(false);
  });
});
