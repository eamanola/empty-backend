const {
  findOne,
  insertOne,
  replaceOne,
  deleteOne,
  find,
  updateOne,

  deleteAll,
  count,
} = require('.');

const table = 'test';

describe('db test', () => {
  afterEach(() => deleteAll(table));

  describe('insertOne', () => {
    it('should return an id, and save the entry', async () => {
      const entry = { foo: 1 };
      expect(entry.id).toBeFalsy();

      const { id } = await insertOne(table, entry);
      expect(id).toBeTruthy();

      const inserted = await findOne(table, { id });
      expect(inserted).toEqual({ ...entry, id });
    });
  });

  describe('findOne', () => {
    it('should find one item', async () => {
      const entry = { foo: 1 };
      await insertOne(table, entry);

      const inserted = await findOne(table, entry);
      expect(inserted).toEqual(expect.objectContaining(entry));
    });

    it('should retrun null, if not found', async () => {
      const nonExisting = await findOne(table, { foo: 1 });
      expect(nonExisting).toBe(null);
    });
  });

  describe('replaceOne', () => {
    it('should replace one item', async () => {
      const entry = { foo: 1 };
      const { id } = await insertOne(table, entry);

      await replaceOne(table, entry, { foo: 2 });

      const inserted = await findOne(table, { id });
      expect(inserted.foo).toBe(2);
    });

    it('should not partially update an entry', async () => {
      const entry = { bar: 1, baz: 1 };
      const { id } = await insertOne(table, entry);

      await replaceOne(table, entry, { bar: 2 });

      const inserted = await findOne(table, { id });
      expect(inserted.bar).toBe(2);
      expect(inserted.baz).toBeFalsy();
    });
  });

  describe('deleteOne', () => {
    it('should delete one', async () => {
      const entry = { foo: 1 };
      const { id } = await insertOne(table, entry);

      await deleteOne(table, { id });

      expect(await findOne(table, { id })).toBe(null);
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

  describe('updateOne', () => {
    it('should update one item', async () => {
      const entry = { foo: 1 };
      const { id } = await insertOne(table, entry);

      await updateOne(table, entry, { foo: 2 });

      const inserted = await findOne(table, { id });
      expect(inserted.foo).toBe(2);
    });

    it('should partially update an entry', async () => {
      const entry = { bar: 1, baz: 1 };
      const { id } = await insertOne(table, entry);

      await updateOne(table, entry, { bar: 2 });

      const inserted = await findOne(table, { id });
      expect(inserted.bar).toBe(2);
      expect(inserted.baz).toBe(1);
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
  });
});
