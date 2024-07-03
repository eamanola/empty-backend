const { string, object } = require('yup');

const { count, deleteAll, dropTable } = require('../db');

const restModel = require('./model');

const columns = [{ name: 'foo', required: true, type: 'string' }];

const table = { columns, name: 'test' };

const {
  insertOne,
  replaceOne,
  deleteOne,
  find,
  findOne,
} = restModel(table, { userRequired: false });

const createResource = async () => {
  const newResource = { foo: 'bar' };
  const { id } = await insertOne(newResource);
  return findOne({ id });
};

describe('rest-model', () => {
  afterAll(() => dropTable(table.name));

  afterEach(() => deleteAll(table.name));

  describe('insert', () => {
    it('should create one', async () => {
      expect(await count(table.name)).toBe(0);

      const newResource = { foo: 'bar' };

      await insertOne(newResource);

      expect(await count(table.name)).toBe(1);
      expect(await findOne(newResource)).toBeTruthy();
    });

    it('should not create invalid', async () => {
      expect(await count(table.name)).toBe(0);

      const newResource = { bar: 'bar' };

      try {
        await insertOne(newResource);
      } catch (err) {
        expect(err).toBeTruthy();
      } finally {
        expect(await count(table.name)).toBe(0);
      }
    });
  });

  describe('replace', () => {
    it('should replace one', async () => {
      const inserted = await createResource();
      const modified = { ...inserted, foo: 'baz' };

      expect(inserted.foo).not.toBe(modified.foo);
      expect(await count(table.name)).toBe(1);

      await replaceOne(inserted, modified);

      expect(await count(table.name)).toBe(1);

      const replaced = await findOne({ id: inserted.id });
      expect(replaced.foo).toBe(modified.foo);
    });

    it('should not replace invalid', async () => {
      const inserted = await createResource();
      const modified = { bar: 'baz' };

      try {
        await replaceOne(inserted, modified);
      } catch (err) {
        expect(err).toBeTruthy();
      } finally {
        expect(await findOne(inserted)).toBeTruthy();
        expect(await count(table.name)).toBe(1);
      }
    });
  });

  describe('delete', () => {
    it('should delete one', async () => {
      const existing = await createResource();

      expect(await count(table.name)).toBe(1);

      await deleteOne(existing);

      expect(await count(table.name)).toBe(0);
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
      expect(await count(table.name)).toBe(1);

      try {
        await deleteOne(null);
        expect('Should not reach').toBe(true);
      } catch (err) {
        expect(err).toBeTruthy();
      } finally {
        expect(await count(table.name)).toBe(1);
      }

      try {
        await deleteOne();
        expect('Should not reach').toBe(true);
      } catch (err) {
        expect(err).toBeTruthy();
      } finally {
        expect(await count(table.name)).toBe(1);
      }

      try {
        await deleteOne({});
        expect('Should not reach').toBe(true);
      } catch (err) {
        expect(err).toBeTruthy();
      } finally {
        expect(await count(table.name)).toBe(1);
      }

      try {
        await deleteOne({ foo: '1234' });
        expect('Should not reach').toBe(true);
      } catch (err) {
        expect(err).toBeTruthy();
      } finally {
        expect(await count(table.name)).toBe(1);
      }

      expect(await findOne({ id })).toBeTruthy();
    });
  });

  it('should find many', async () => {
    const newResource = { foo: 'bar' };

    expect(await count(table.name)).toBe(0);
    await insertOne(newResource);
    await insertOne(newResource);
    await insertOne(newResource);

    const results = await find(newResource);

    expect(results.length).toBe(3);
  });

  it('should find one', async () => {
    const newResource = { foo: 'bar' };

    expect(await count(table.name)).toBe(0);
    await insertOne(newResource);
    await insertOne(newResource);
    await insertOne(newResource);

    const result = await findOne(newResource);

    expect(result).toEqual(expect.objectContaining(newResource));
  });

  describe('optional params', () => {
    beforeEach(async () => dropTable(table.name));
    describe('userRequired', () => {
      it('insert should require owner property', async () => {
        const model = restModel(table, { userRequired: true });
        await model.init();

        const newResource = { foo: 'bar' };

        try {
          await model.insertOne(newResource);
        } catch (err) {
          expect(err).toBeTruthy();
        } finally {
          expect(await count(table.name)).toBe(0);
        }

        await model.insertOne({ ...newResource, owner: 'owner' });
        expect(await count(table.name)).toBe(1);
      });

      it('replace should require owner property', async () => {
        const model = restModel(table, { userRequired: true });
        await model.init();

        const { id } = await model.insertOne({ foo: 'bar', owner: 'baz' });
        const inserted = await model.findOne({ id });
        const modified = { foo: 'baz', id };
        expect(inserted.foo).not.toBe(modified.foo);

        try {
          await model.replaceOne(inserted, modified);
        } catch (err) {
          expect(err).toBeTruthy();
        } finally {
          expect((await model.findOne({ id })).foo).toBe(inserted.foo);
        }

        await model.replaceOne(inserted, { ...modified, owner: 'owner' });
        expect((await model.findOne({ id })).foo).toBe(modified.foo);
      });
    });

    describe('validator', () => {
      it('should accept a custom validator', async () => {
        const validator = object({ foo: string().email().required() }).noUnknown().strict();
        const model = restModel(table, { userRequired: false, validator });
        await model.init();

        try {
          await model.insertOne({ foo: 'not-email' });
          expect(false).toBe(true);
        } catch (err) {
          expect(true).toBe(true);
        }

        const email = 'foo@example.com';
        const { id } = await model.insertOne({ foo: email });
        expect((await model.findOne({ id })).foo).toBe(email);
      });
    });
  });

  describe('reserved fields', () => {
    it('insert should throw, if reserved field used', () => {
      ['id', 'modified', 'owner'].forEach((reserved) => {
        try {
          restModel({ ...table, columns: [{ name: reserved, type: 'string' }] });
          expect('unreachable').toBe(true);
        } catch (err) {
          expect(true).toBe(true);
        }
      });
    });
  });

  describe('type conversion', () => {
    it('should return right types', async () => {
      dropTable(table.name);
      const model = restModel(
        {
          ...table,
          columns: [
            { name: 'bool', type: 'bool' },
            { name: 'date', type: 'date' },
            { name: 'number', type: 'number' },
            { name: 'string', type: 'string' },
          ],
        },
        { userRequired: false },
      );
      await model.init();

      const obj = {
        bool: true,
        date: new Date(),
        number: 1,
        string: 'str',
      };

      await model.insertOne(obj);

      const saved = await model.findOne({ number: 1 });

      expect(saved).toEqual(expect.objectContaining(obj));
      expect(typeof saved.bool).toBe('boolean');
      expect(saved.date instanceof Date).toBe(true);
      expect(typeof saved.number).toBe('number');
      expect(typeof saved.string).toBe('string');
    });
  });
});
