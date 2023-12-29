const {
  createUser,
  validNewNote,
} = require('../jest/test-helpers');

const { findOne } = require('../models/notes');

const { create } = require('./notes');

const publicNotes = require('./public-notes');

const createNote = async (user, { isPublic = false } = {}) => {
  const { id } = await create(user, validNewNote({ isPublic }));
  return findOne({ id });
};

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
