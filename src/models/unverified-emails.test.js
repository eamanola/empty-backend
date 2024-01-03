const { upsert, deleteOne, table } = require('./unverified-emails');

const validator = require('../validators/unverified-emails');

const { count, deleteMany, findOne } = require('../db');

const validUnverifiedEmail = {
  userId: 'foo',
  newEmail: 'bar@example.com',
};

describe('unverified-emails model', () => {
  beforeAll(async () => {
    expect(await validator.validate(validUnverifiedEmail)).toEqual(validUnverifiedEmail);
  });

  beforeEach(() => deleteMany(table, {}));

  describe('upsert', () => {
    it('should create one', async () => {
      expect(await count(table)).toBe(0);

      await upsert(validUnverifiedEmail);

      expect(await count(table)).toBe(1);
      expect(await findOne(table, validUnverifiedEmail)).toBeTruthy();
    });

    it('should not create invalid', async () => {
      expect(await count(table)).toBe(0);

      const invalid = { ...validUnverifiedEmail, userId: '' };
      try {
        await validator.validate(invalid);
        expect('unreachable').toBe(true);
      } catch (e) {
        expect(true).toBe(true);
      }

      try {
        await upsert(invalid);
      } catch (e) {
        expect(e).toBeTruthy();
      } finally {
        expect(await count(table)).toBe(0);
      }
    });

    it('should replace existing, based on userId', async () => {
      await upsert(validUnverifiedEmail);

      expect(await count(table)).toBe(1);

      const replacement = { ...validUnverifiedEmail, newEmail: 'baz@example.com' };
      expect(replacement.userId).toBe(validUnverifiedEmail.userId);
      expect(replacement).not.toEqual(validUnverifiedEmail);

      await upsert(replacement);

      expect(await findOne(table, validUnverifiedEmail)).toBeFalsy();
      expect(await findOne(table, replacement)).toBeTruthy();

      expect(await count(table)).toBe(1);
    });
  });

  describe('deleteOne', () => {
    it('should delete one', async () => {
      await upsert(validUnverifiedEmail);
      expect(await count(table)).toBe(1);

      await deleteOne(validUnverifiedEmail);

      expect(await count(table)).toBe(0);
    });
  });
});
