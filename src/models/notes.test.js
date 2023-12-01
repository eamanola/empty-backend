const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
  count,
  findOne,
} = require('../db');

const notes = require('./notes');

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

  beforeEach(() => deleteMany(notes.table));

  it('should create one', async () => {
    const newNote = {
      text: 'foo',
      owner: 'owner',
      public: false,
    };

    expect(await count(notes.table)).toBe(0);
    await notes.insertOne(newNote);
    expect(await count(notes.table)).toBe(1);
    expect(await findOne(notes.table, newNote)).toBeTruthy();
  });

  it('should replace one', async () => {
    const newNote = {
      text: 'foo',
      owner: 'owner',
      public: false,
    };

    await notes.insertOne(newNote);
    const insertedNote = await findOne(notes.table, newNote);

    const modifiedNote = {
      ...insertedNote,
      text: 'bar',
    };

    await notes.replaceOne(modifiedNote);
    const replacedNote = await findOne(notes.table, { text: modifiedNote.text });

    expect(await count(notes.table)).toBe(1);
    expect(await findOne(notes.table, { text: insertedNote.text })).toBeFalsy();
    expect(await findOne(notes.table, { text: replacedNote.text })).toBeTruthy();
    expect(replacedNote.id).toBeTruthy();
    expect(insertedNote.id).toBe(replacedNote.id);
  });

  it('should delete one', async () => {
    const newNote = {
      text: 'foo',
      owner: 'owner',
      public: false,
    };

    await notes.insertOne(newNote);
    expect(await count(notes.table)).toBe(1);

    try {
      await notes.deleteOne(null);
    } catch (e) {
      expect(true).toBe(true);
    } finally {
      expect(await count(notes.table)).toBe(1);
    }

    try {
      await notes.deleteOne();
    } catch (e) {
      expect(true).toBe(true);
    } finally {
      expect(await count(notes.table)).toBe(1);
    }

    const existingNote = await findOne(notes.table, newNote);
    await notes.deleteOne(existingNote);
    expect(await count(notes.table)).toBe(0);
  });

  it('should find by owner', async () => {
    const owner = 'owner';

    const newNote = {
      text: 'foo',
      owner,
      public: false,
    };

    expect(await count(notes.table)).toBe(0);
    await notes.insertOne(newNote);
    await notes.insertOne({ ...newNote, text: 'bar' });
    await notes.insertOne({ ...newNote, text: 'baz' });

    const insertedNotes = await notes.find({ owner });

    expect(await count(notes.table)).toBe(insertedNotes.length);
  });
});
