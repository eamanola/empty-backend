const { createUser, validNewNote } = require('../jest/test-helpers');

const { findOne, replaceOne } = require('../models/notes');

const {
  byId: fromCacheById,
  cacheById,
  byOwner: fromCacheByOwner,
  cacheByOwner,
} = require('./notes');

const {
  create,
  byId,
  byOwner,
  update,
  remove,
} = require('../controllers/notes');

const createNote = async (user, { isPublic = false } = {}) => {
  const { id } = await create(user, validNewNote({ isPublic }));
  return findOne({ id });
};

describe('cache', () => {
  describe('byId', () => {
    it('should cache the value', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      expect(await fromCacheById(user, createdNote)).toBeFalsy();

      const noteById = await byId(user, createdNote);
      expect(noteById).toBeTruthy();

      expect(await fromCacheById(user, createdNote)).toEqual(noteById);
    });
    it('should use cache if available', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      await cacheById(user, createdNote);
      expect(await fromCacheById(user, createdNote)).toEqual(createdNote);

      await replaceOne({ id: createdNote.id }, { ...createdNote, text: 'new text' });

      const dbEntry = await findOne({ id: createdNote.id });
      expect(dbEntry.text).not.toBe(createdNote.text);

      const noteById = await byId(user, createdNote);
      expect(await fromCacheById(user, createdNote)).toEqual(noteById);
      expect(noteById.text).not.toBe(dbEntry.text);
    });
  });

  describe('byOwner', () => {
    it('should cache the value', async () => {
      const user = await createUser();
      await createNote(user);

      expect(await fromCacheByOwner(user)).toBeFalsy();

      const notes = await byOwner(user);
      expect(notes).toBeTruthy();

      expect(await fromCacheByOwner(user)).toEqual(notes);
    });
    it('should use cache if available', async () => {
      const user = await createUser();
      const cachedNotes = [await createNote(user)];

      await cacheByOwner(user, cachedNotes);
      expect(await fromCacheByOwner(user)).toEqual(cachedNotes);

      await replaceOne({ id: cachedNotes[0].id }, { ...cachedNotes[0], text: 'new text' });

      const dbEntry = await findOne({ owner: cachedNotes[0].owner });
      expect(dbEntry).toBeTruthy();
      expect(dbEntry.text).not.toBe(cachedNotes[0].text);

      const notes = await byOwner(user);
      expect(notes.length).toBe(1);
      expect(notes[0]).toEqual(cachedNotes[0]);
      expect(notes[0].text).not.toBe(dbEntry.text);
    });
  });

  describe('create', () => {
    it('should invalidate byOwner cache', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      await cacheByOwner(user, [createdNote]);
      expect(await fromCacheByOwner(user)).toBeTruthy();

      await create(user, validNewNote());

      expect(await fromCacheByOwner(user)).toBeFalsy();
    });
  });

  describe('update', () => {
    it('should invalidate byId and byOwner cache', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      await cacheById(user, createdNote);
      expect(await fromCacheById(user, createdNote)).toBeTruthy();

      await cacheByOwner(user, [createdNote]);
      expect(await fromCacheByOwner(user)).toBeTruthy();

      await update(user, { ...createdNote, text: 'new text' });

      expect(await fromCacheById(user, createdNote)).toBeFalsy();
      expect(await fromCacheByOwner(user)).toBeFalsy();
    });
  });

  describe('remove', () => {
    it('should invalidate byId and byOwner cache', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      await cacheById(user, createdNote);
      expect(await fromCacheById(user, createdNote)).toBeTruthy();

      await cacheByOwner(user, [createdNote]);
      expect(await fromCacheByOwner(user)).toBeTruthy();

      await remove(user, { ...createdNote, text: 'new text' });

      expect(await fromCacheById(user, createdNote)).toBeFalsy();
      expect(await fromCacheByOwner(user)).toBeFalsy();
    });
  });
});
