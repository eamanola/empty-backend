const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
  count,
} = require('../db');

const {
  table,
  insertOne,
  replaceOne,
  deleteOne,
  find,
  findOne,
} = require('./notes');

let mongod;

describe('notes model', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    initDB(uri);
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
    await mongod.stop();
  });

  beforeEach(() => deleteMany(table));

  it('should create one', async () => {
    const newNote = {
      text: 'foo',
      owner: 'owner',
      public: false,
    };

    expect(await count(table)).toBe(0);
    await insertOne(newNote);
    expect(await count(table)).toBe(1);
    expect(await findOne(newNote)).toBeTruthy();
  });

  it('should replace one', async () => {
    const newNote = {
      text: 'foo',
      owner: 'owner',
      public: false,
    };

    await insertOne(newNote);
    const insertedNote = await findOne(newNote);

    const modifiedNote = {
      ...insertedNote,
      text: 'bar',
    };

    await replaceOne(modifiedNote);
    const replacedNote = await findOne({ text: modifiedNote.text });

    expect(await count(table)).toBe(1);
    expect(await findOne({ text: insertedNote.text })).toBeFalsy();
    expect(await findOne({ text: replacedNote.text })).toBeTruthy();
    expect(replacedNote.id).toBeTruthy();
    expect(insertedNote.id).toBe(replacedNote.id);
  });

  it('should delete one', async () => {
    const newNote = {
      text: 'foo',
      owner: 'owner',
      public: false,
    };

    await insertOne(newNote);
    expect(await count(table)).toBe(1);

    try {
      await deleteOne(null);
      expect(false).toBe(true);
    } catch (e) {
      expect(true).toBe(true);
    } finally {
      expect(await count(table)).toBe(1);
    }

    try {
      await deleteOne();
      expect(false).toBe(true);
    } catch (e) {
      expect(true).toBe(true);
    } finally {
      expect(await count(table)).toBe(1);
    }

    const existingNote = await findOne(newNote);
    await deleteOne(existingNote);
    expect(await count(table)).toBe(0);
  });

  it('should find by owner', async () => {
    const owner = 'owner';

    const newNote = {
      text: 'foo',
      owner,
      public: false,
    };

    expect(await count(table)).toBe(0);
    await insertOne(newNote);
    await insertOne({ ...newNote, text: 'bar' });
    await insertOne({ ...newNote, text: 'baz' });

    const insertedNotes = await find({ owner });

    expect(await count(table)).toBe(insertedNotes.length);
  });
});
