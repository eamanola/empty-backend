const {
  initDB,
  connectDB,
  closeDB,
} = require('../db');

const {
  deleteUsers,
  deleteNotes,
  countNotes,
  createUser,
  validNewNote,
} = require('../jest/test-helper.test');

const { findOne } = require('../models/notes');

const {
  create,
  byId,
  byOwner,
  update,
  remove,
  publicNotes,
} = require('./notes');

const createNote = async (user, { isPublic = false } = {}) => {
  const { id } = await create(user, validNewNote({ isPublic }));
  return findOne({ id });
};

describe('notes controller', () => {
  beforeAll(async () => {
    await initDB();
    await connectDB();
  });

  afterAll(closeDB);

  beforeEach(async () => {
    await deleteUsers();
    await deleteNotes();
  });

  describe('create', () => {
    it('should create a note', async () => {
      const user = await createUser();
      const newNote = validNewNote();

      expect(await countNotes()).toBe(0);

      await create(user, newNote);

      expect(await countNotes()).toBe(1);
      expect(await findOne(newNote)).toBeTruthy();
    });

    it('should override owner', async () => {
      const user = await createUser();
      const newNote = validNewNote();

      const fakeOwner = '1234';
      expect(user.id).not.toBe(fakeOwner);

      await create(user, {
        ...newNote,
        owner: fakeOwner,
      });

      expect((await findOne(newNote)).owner).toBe(user.email);
    });
  });

  describe('byId', () => {
    it('should find by id', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      const noteById = await byId(user, { id: createdNote.id });

      expect(createdNote).toEqual(noteById);
    });

    it('should not return notes of other users', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      const user2 = await createUser({ email: 'bar@example.com' });

      expect(await byId(user, { id: createdNote.id })).toBeTruthy();
      expect(await byId(user2, { id: createdNote.id })).toBeFalsy();
    });
  });

  describe('byOwner', () => {
    it('should find all user notes', async () => {
      const user = await createUser();

      const TIMES = 3;
      const promises = [];
      for (let i = 0; i < TIMES; i += 1) {
        promises.push(createNote(user));
      }
      await Promise.all(promises);

      const createdNotes = await byOwner(user);
      expect(createdNotes.length).toBe(TIMES);
    });

    it('should not return notes of other users', async () => {
      const user = await createUser();
      await createNote(user);

      const user2 = await createUser({ email: 'bar@example.com' });
      await createNote(user2);

      expect(await countNotes()).toBe(2);

      const userNotes = await byOwner(user);

      expect(userNotes.length).toBe(1);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      const newText = 'text2';
      expect(newText).not.toBe(createdNote.text);

      await update(
        user,
        { ...createdNote, text: newText },
      );

      const updatedNote = await byId(user, { id: createdNote.id });

      expect(updatedNote.text).toBe(newText);
      expect((await byOwner(user)).length).toBe(1);
    });

    it('should not update owner', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      const fakeOwner = 'foo';
      expect(fakeOwner).not.toBe(createdNote.owner);

      await update(
        user,
        { ...createdNote, owner: fakeOwner },
      );

      const updatedNote = await byId(user, { id: createdNote.id });

      expect(updatedNote.owner).toBe(createdNote.owner);
    });

    it('should not update modified', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      const modified = 'foo';
      expect(modified).not.toBe(createdNote.modified);

      await update(
        user,
        { ...createdNote, modified },
      );

      const updatedNote = await byId(user, { id: createdNote.id });

      expect(updatedNote.modified).not.toBe(modified);
    });

    it('should not update id', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      const id = `ABCDE${createdNote.id.substring(5)}`;
      expect(id).not.toBe(createdNote.id);

      await update(
        user,
        { ...createdNote, id },
      );

      const updatedNote = await byId(user, { id: createdNote.id });

      expect(updatedNote.id).toBe(createdNote.id);
    });

    it('should not update notes of other users', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      const newText = 'text2';
      expect(newText).not.toBe(createdNote.text);

      const user2 = await createUser({ email: 'bar@example.com' });

      await update(
        user2,
        { ...createdNote, text: newText },
      );

      expect(await byId(user, { id: createdNote.id })).toEqual(createdNote);
      expect(await findOne({ text: newText })).toBeFalsy();
    });
  });

  describe('remove', () => {
    it('should remove a note', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      expect((await byOwner(user)).length).toBe(1);

      await remove(user, createdNote);

      expect((await byOwner(user)).length).toBe(0);
    });

    it('should not remove notes of other users', async () => {
      const user = await createUser();
      const createdNote = await createNote(user);

      const user2 = await createUser({ email: 'bar@example.com' });

      expect((await byOwner(user)).length).toBe(1);

      await remove(user2, createdNote);

      expect((await byOwner(user)).length).toBe(1);
    });
  });

  describe('publicNotes', () => {
    it('should return public notes', async () => {
      const user = await createUser();

      const PUBLIC_LIMIT = 15;
      const PRIVATE_LIMIT = 20;

      const promises = [];
      for (let i = 0; i < PUBLIC_LIMIT; i += 1) {
        promises.push(createNote(user, { isPublic: true }));
      }
      for (let i = 0; i < PRIVATE_LIMIT; i += 1) {
        promises.push(createNote(user, { isPublic: false }));
      }
      await Promise.all(promises);

      const notes = await publicNotes();

      expect(notes.every(({ isPublic }) => isPublic === true)).toBe(true);
      expect(notes.length).toBe(PUBLIC_LIMIT);
    });

    it('should accept an optinal limit option', async () => {
      const user = await createUser();

      const PUBLIC_LIMIT = 15;
      const LIMIT = 5;
      expect(LIMIT < PUBLIC_LIMIT).toBe(true);

      const promises = [];
      for (let i = 0; i < PUBLIC_LIMIT; i += 1) {
        promises.push(createNote(user, { isPublic: true }));
      }

      await Promise.all(promises);

      const notes = await publicNotes({ limit: LIMIT });
      expect(notes.length).toBe(LIMIT);
    });

    it('should accept an optinal offset option', async () => {
      const user = await createUser();

      const PUBLIC_LIMIT = 15;
      const LIMIT = 5;
      const OFFSET = 3;
      expect(LIMIT < PUBLIC_LIMIT).toBe(true);
      expect(OFFSET > 0).toBe(true);
      expect(LIMIT + OFFSET < PUBLIC_LIMIT).toBe(true);

      const promises = [];
      for (let i = 0; i < PUBLIC_LIMIT; i += 1) {
        promises.push(createNote(user, { isPublic: true }));
      }

      await Promise.all(promises);

      const allPublicNotes = await publicNotes();
      expect(allPublicNotes.length).toBe(PUBLIC_LIMIT);

      const notes = await publicNotes({ limit: LIMIT, offset: OFFSET });
      expect(notes.length).toBe(LIMIT);

      for (let i = 0; i < LIMIT; i += 1) {
        expect(notes[i]).toEqual(allPublicNotes[i + OFFSET]);
      }

      const notesNoLimit = await publicNotes({ offset: OFFSET });
      expect(notesNoLimit.length).toBe(PUBLIC_LIMIT - OFFSET);

      for (let i = 0; i < PUBLIC_LIMIT - OFFSET; i += 1) {
        expect(notesNoLimit[i]).toEqual(allPublicNotes[i + OFFSET]);
      }
    });
  });
});
