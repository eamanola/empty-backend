const {
  count,
  createTable,
  deleteAll,
  deleteOne,
  dropTable,
  find,
  findOne,
  insertOne,
  replaceOne,
  updateOne,
} = require('.');

const table = 'test';

describe('db test', () => {
  beforeAll(() => createTable(
    table,
    [
      { name: 'foo', type: 'number' },
      { name: 'bar', type: 'number' },
      { default: 0, name: 'baz', type: 'number' },
    ],
  ));
  afterAll(() => dropTable(table));

  afterEach(() => deleteAll(table));

  describe('count', () => {
    it('should count all by default', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);
      await insertOne(table, { bar: 1 });

      expect(await count(table)).toBe(3);
    });

    it('should filter according to where', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);
      await insertOne(table, { bar: 1 });

      expect(await count(table, entry)).toBe(2);
    });

    it('should filter according to where', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);
      await insertOne(table, { bar: 1 });

      expect(await count(table, { bar: 1 })).toBe(1);
    });
  });

  describe('deleteAll', () => {
    it('should delete all by default', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);
      await insertOne(table, { bar: 1 });

      await deleteAll(table);

      const entries = await find(table);

      expect(entries.length).toBe(0);
    });

    it('should filter according to where', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);
      await insertOne(table, { bar: 1 });

      await deleteAll(table, entry);

      const entries = await find(table);

      expect(entries.length).toBe(1);
      expect(entries[0]).toEqual(expect.objectContaining({ bar: 1 }));
    });
  });

  describe('deleteOne', () => {
    it('should delete one', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);

      await deleteOne(table, entry);

      expect(await count(table, entry)).toBe(1);
    });

    it('should not delete multiple items', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);

      await deleteOne(table, entry);

      expect(await count(table, entry)).toBe(1);
    });

    it('should delete one without where', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);

      await deleteOne(table);

      expect(await count(table)).toBe(1);
    });
  });

  describe('find', () => {
    it('should find all by default', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);
      await insertOne(table, { bar: 1 });

      const entries = await find(table);

      expect(entries.length).toBe(3);
    });

    it('should filter according to where', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);
      await insertOne(table, { bar: 1 });

      const entries = await find(table, entry);

      expect(entries.length).toBe(2);
      entries.forEach((element) => {
        expect(element).toEqual(expect.objectContaining(entry));
      });
    });

    it('should accept optional limit', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);
      await insertOne(table, entry);

      const entries = await find(table, entry, { limit: 2 });

      expect(entries.length).toBe(2);
    });

    it('should accept optional offset', async () => {
      const entry = { foo: 1 };
      await insertOne(table, { ...entry, bar: 1 });
      await insertOne(table, { ...entry, bar: 2 });
      await insertOne(table, { ...entry, bar: 3 });

      const entries = await find(table, entry, { offset: 2 });

      expect(entries.length).toBe(1);
      expect(entries[0]).toEqual(expect.objectContaining({ ...entry, bar: 3 }));
    });

    it('and a combo of', async () => {
      const entry = { foo: 1 };
      await insertOne(table, { ...entry, bar: 1 });
      await insertOne(table, { ...entry, bar: 2 });
      await insertOne(table, { ...entry, bar: 3 });

      const entries = await find(table, entry, { limit: 1, offset: 1 });

      expect(entries.length).toBe(1);
      expect(entries[0]).toEqual(expect.objectContaining({ ...entry, bar: 2 }));
    });
  });

  describe('findOne', () => {
    it('should find one item', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);

      const result = await findOne(table, entry);
      expect(result).toEqual(expect.objectContaining(entry));
    });

    it('should retrun null, if not found', async () => {
      const nonExisting = await findOne(table, { foo: 1 });
      expect(nonExisting).toBe(null);
    });

    it('should not return multiple items', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);

      const result = await findOne(table, entry);
      expect(result).toEqual(expect.objectContaining(entry));
    });
  });

  describe('insertOne', () => {
    it('should save the new entry', async () => {
      const entry = { foo: 1 };
      expect(await count(table)).toBe(0);

      await insertOne(table, entry);

      expect(await count(table)).toBe(1);

      const inserted = await findOne(table, entry);
      expect(inserted).toEqual(expect.objectContaining(entry));
    });
  });

  describe('replaceOne', () => {
    it('should replace one item', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);

      await replaceOne(table, entry, { foo: 2 });

      expect(await findOne(table, { foo: 1 })).toBeFalsy();
      expect(await findOne(table, { foo: 2 })).toBeTruthy();

      expect(await count(table)).toBe(1);
    });

    it('should not partially update an entry', async () => {
      const entry = { bar: 1, baz: 1 };
      await insertOne(table, entry);

      await replaceOne(table, entry, { bar: 2 });

      const inserted = await findOne(table, { bar: 2 });
      expect(inserted.bar).toBe(2);
      expect(inserted.baz).toBeFalsy();
    });

    it('should not replace multiple items', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);

      await replaceOne(table, entry, { foo: 2 });

      expect(await count(table, { foo: 1 })).toBe(1);
      expect(await count(table, { foo: 2 })).toBe(1);
    });

    it('should not upsert', async () => {
      const nonExisting = { baz: 2 };
      const newRow = { bar: 2 };
      await replaceOne(table, nonExisting, newRow);

      expect(await findOne(table, newRow)).toBeFalsy();
    });
  });

  describe('updateOne', () => {
    it('should update one item', async () => {
      const entry = { bar: 1, foo: 1 };
      await insertOne(table, entry);

      await updateOne(table, entry, { foo: 2 });

      const inserted = await findOne(table, { bar: 1 });
      expect(inserted.foo).toBe(2);
    });

    it('should not update multiple items', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);
      await insertOne(table, entry);

      await updateOne(table, entry, { foo: 2 });

      expect(await count(table, { foo: 1 })).toBe(1);
      expect(await count(table, { foo: 2 })).toBe(1);
    });

    it('should partially update an entry', async () => {
      const entry = { bar: 1, baz: 1 };
      await insertOne(table, entry);

      await updateOne(table, entry, { bar: 2 });

      const inserted = await findOne(table, { baz: 1 });
      expect(inserted.bar).toBe(2);
      expect(inserted.baz).toBe(1);
    });

    it('should not upsert', async () => {
      const nonExisting = { baz: 2 };
      const newRow = { bar: 2 };
      await updateOne(table, nonExisting, newRow);

      expect(await findOne(table, newRow)).toBeFalsy();
    });
  });
});
