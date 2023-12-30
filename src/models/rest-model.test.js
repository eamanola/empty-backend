const { string, object } = require('yup');

const restModel = require('./rest-model');

const validator = object({ foo: string().required() }).noUnknown().strict();

const { count, deleteMany } = require('../db');

const table = 'test';

const {
  insertOne,
  replaceOne,
  deleteOne,
  find,
  findOne,
} = restModel(table, validator);

const createResource = async () => {
  const newResource = { foo: 'bar' };
  const { id } = await insertOne(newResource);
  return findOne({ id });
};

describe('rest-model', () => {
  beforeEach(() => deleteMany(table, {}));

  describe('insert', () => {
    it('should create one', async () => {
      expect(await count(table)).toBe(0);

      const newResource = { foo: 'bar' };

      await insertOne(newResource);

      expect(await count(table)).toBe(1);
      expect(await findOne(newResource)).toBeTruthy();
    });

    it('should not create invalid', async () => {
      expect(await count(table)).toBe(0);

      const newResource = { bar: 'bar' };

      try {
        await insertOne(newResource);
      } catch (e) {
        expect(e).toBeTruthy();
      } finally {
        expect(await count(table)).toBe(0);
      }
    });
  });

  describe('replace', () => {
    it('should replace one', async () => {
      const inserted = await createResource();
      const modified = { ...inserted, foo: 'baz' };

      expect(inserted.foo).not.toBe(modified.foo);
      expect(await count(table)).toBe(1);

      await replaceOne(inserted, modified);

      expect(await count(table)).toBe(1);

      const replaced = await findOne({ id: inserted.id });
      expect(replaced.foo).toBe(modified.foo);
    });

    it('should not replace invalid', async () => {
      const inserted = await createResource();

      const modified = { bar: 'baz' };

      try {
        await replaceOne(inserted, modified);
      } catch (e) {
        expect(e).toBeTruthy();
      } finally {
        expect(await findOne(inserted)).toBeTruthy();
        expect(await findOne(modified)).toBeFalsy();
      }
    });
  });

  describe('delete', () => {
    it('should delete one', async () => {
      const existing = await createResource();

      expect(await count(table)).toBe(1);

      await deleteOne(existing);

      expect(await count(table)).toBe(0);
    });

    it('should require id to delete', async () => {
      const resource = { foo: 'bar' };
      await insertOne(resource);
      expect(await findOne(resource)).toBeTruthy();

      await deleteOne(resource);

      expect(await findOne(resource)).toBeTruthy();
    });

    it('should not delete randomly', async () => {
      const { id } = await createResource();
      expect(await count(table)).toBe(1);

      try {
        await deleteOne(null);
        expect('Should not reach').toBe(true);
      } catch (e) {
        expect(e).toBeTruthy();
      } finally {
        expect(await count(table)).toBe(1);
      }

      try {
        await deleteOne();
        expect('Should not reach').toBe(true);
      } catch (e) {
        expect(e).toBeTruthy();
      } finally {
        expect(await count(table)).toBe(1);
      }

      try {
        await deleteOne({});
        expect('Should not reach').toBe(true);
      } catch (e) {
        expect(e).toBeTruthy();
      } finally {
        expect(await count(table)).toBe(1);
      }

      try {
        await deleteOne({ foo: '1234' });
        expect('Should not reach').toBe(true);
      } catch (e) {
        expect(e).toBeTruthy();
      } finally {
        expect(await count(table)).toBe(1);
      }

      expect(await findOne({ id })).toBeTruthy();
    });
  });

  it('should find many', async () => {
    const newResource = { foo: 'bar' };

    expect(await count(table)).toBe(0);
    await insertOne(newResource);
    await insertOne(newResource);
    await insertOne(newResource);

    const results = await find(newResource);

    expect(results.length).toBe(3);
  });

  it('should find one', async () => {
    const newResource = { foo: 'bar' };

    expect(await count(table)).toBe(0);
    await insertOne(newResource);
    await insertOne(newResource);
    await insertOne(newResource);

    const result = await findOne(newResource);

    expect(result).toEqual(expect.objectContaining(newResource));
  });
});
