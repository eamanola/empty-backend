const bcrypt = require('bcrypt');

const { countUsers, deleteUsers, findUser } = require('../../jest/test-helpers');

const { authenticate: login } = require('.');

const create = require('./create');

describe('signup', () => {
  beforeEach(deleteUsers);

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

    await create({
      email,
      password,
    });

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
    } catch (err) {
      expect(err).toBeTruthy();
    } finally {
      expect(await countUsers()).toBe(1);
    }
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

    const user = await findUser({ email });

    expect(user.emailVerified).toBe(false);
  });

  it('should return id of created user', async () => {
    const email = 'foo@example.com';
    const password = '123';

    const id = await create({ email, password });

    const user = await findUser({ id });

    expect(user.email).toBe(email);
  });
});
