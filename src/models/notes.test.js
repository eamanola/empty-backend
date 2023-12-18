const {
  initDB,
  connectDB,
  closeDB,
} = require('../db');

const {
  deleteNotes,
  countNotes,
  validNewNote,
} = require('../jest/test-helpers');

const {
  insertOne,
  replaceOne,
  deleteOne,
  find,
  findOne,
} = require('./notes');

const validNewNoteWithOwner = (owner = 'owner') => ({ ...validNewNote(), owner });

const createNote = async () => {
  const newNote = validNewNoteWithOwner();
  const { id } = await insertOne(newNote);
  return findOne({ id });
};

describe('notes model', () => {
  beforeAll(async () => {
    await initDB();
    await connectDB();
  });

  afterAll(closeDB);

  beforeEach(deleteNotes);

  it('should create one', async () => {
    expect(await countNotes()).toBe(0);

    const newNote = validNewNoteWithOwner();

    await insertOne(newNote);

    expect(await countNotes()).toBe(1);
    expect(await findOne(newNote)).toBeTruthy();
  });

  it('should replace one', async () => {
    const insertedNote = await createNote();

    const modifiedNote = {
      ...insertedNote,
      text: 'bar',
    };
    await replaceOne(insertedNote, modifiedNote);
    const replacedNote = await findOne({ text: modifiedNote.text });

    expect(await countNotes()).toBe(1);
    expect(await findOne({ text: insertedNote.text })).toBeFalsy();
    expect(await findOne({ text: replacedNote.text })).toBeTruthy();
    expect(replacedNote.id).toBeTruthy();
    expect(insertedNote.id).toBe(replacedNote.id);
  });

  it('should delete one', async () => {
    const existingNote = await createNote();

    expect(await countNotes()).toBe(1);

    await deleteOne(existingNote);

    expect(await countNotes()).toBe(0);
  });

  it('should not delete randomly', async () => {
    const { id } = await createNote();
    expect(await countNotes()).toBe(1);

    try {
      await deleteOne(null);
      expect('Should not reach').toBe(true);
    } catch (e) {
      expect(e).toBeTruthy();
    } finally {
      expect(await countNotes()).toBe(1);
    }

    try {
      await deleteOne();
      expect('Should not reach').toBe(true);
    } catch (e) {
      expect(e).toBeTruthy();
    } finally {
      expect(await countNotes()).toBe(1);
    }

    try {
      await deleteOne({});
      expect('Should not reach').toBe(true);
    } catch (e) {
      expect(e).toBeTruthy();
    } finally {
      expect(await countNotes()).toBe(1);
    }

    try {
      await deleteOne({ foo: 'bar' });
      expect('Should not reach').toBe(true);
    } catch (e) {
      expect(e).toBeTruthy();
    } finally {
      expect(await countNotes()).toBe(1);
    }

    expect(await findOne({ id })).toBeTruthy();
  });

  it('should find by owner', async () => {
    const owner = 'owner';

    const newNote = validNewNoteWithOwner(owner);

    expect(await countNotes()).toBe(0);
    await insertOne(newNote);
    await insertOne({ ...newNote, text: 'bar' });
    await insertOne({ ...newNote, text: 'baz' });

    const insertedNotes = await find({ owner });

    expect(await countNotes()).toBe(insertedNotes.length);
  });
});
