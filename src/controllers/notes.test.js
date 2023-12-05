const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
  count,
} = require('../db');

const {
  table: usersTable,
  findOne: findOneUser,
} = require('../models/users');

const {
  table: notesTable,
  findOne,
} = require('../models/notes');

const signup = require('./signup');

const {
  create,
  byId,
  byOwner,
  update,
  remove,
} = require('./notes');

jest.mock('../config', () => ({ SECRET: 'shhhhh' }));

let mongod;

const getUser = async ({ email } = { email: 'foo@example.com' }) => {
  await signup({ email, password: '123' });

  return findOneUser({ email });
};

describe('notes controller', () => {
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

  beforeEach(async () => {
    await deleteMany(usersTable);
    await deleteMany(notesTable);
  });

  describe('create', () => {
    it('should create a note', async () => {
      const user = await getUser();
      const note = { text: 'text', public: false };

      expect(await count(notesTable)).toBe(0);

      await create(user, note);

      expect(await count(notesTable)).toBe(1);
      expect(await findOne(note)).toBeTruthy();
    });

    it('should override owner', async () => {
      const user = await getUser();
      const note = { text: 'text', public: false };

      const fakeOwner = '1234';
      expect(user.id).not.toBe(fakeOwner);

      await create(user, {
        ...note,
        owner: fakeOwner,
      });

      expect((await findOne(note)).owner).toBe(user.id);
    });
  });

  describe('byId', () => {
    it('should find by id', async () => {
      const user = await getUser();
      const note = { text: 'text', public: false };
      await create(user, note);
      const createdNote = await findOne(note);

      const noteById = await byId(user, { id: createdNote.id });

      expect(createdNote).toEqual(noteById);
    });

    it('should not return notes of other users', async () => {
      const user = await getUser();
      const note = { text: 'text', public: false };
      await create(user, note);
      const createdNote = await findOne(note);

      const email2 = 'bar@example.com';
      const user2 = await getUser({ email: email2 });

      expect(await byId(user, { id: createdNote.id })).toBeTruthy();
      expect(await byId(user2, { id: createdNote.id })).toBeFalsy();
    });
  });

  describe('byOwner', () => {
    it('should find all user notes', async () => {
      const user = await getUser();
      const note = { text: 'text', public: false };

      const TIMES = 3;
      const promises = [];
      for (let i = 0; i < TIMES; i += 1) {
        promises.push(create(user, { ...note, text: `note${i}` }));
      }
      await Promise.all(promises);

      const createdNotes = await byOwner(user);
      expect(createdNotes.length).toBe(TIMES);
    });

    it('should not return notes of other users', async () => {
      const user = await getUser();
      const note = { text: 'text', public: false };
      await create(user, note);

      const email2 = 'bar@example.com';
      const user2 = await getUser({ email: email2 });
      await create(user2, note);

      expect(await count(notesTable)).toBe(2);

      const userNotes = await byOwner(user);

      expect(userNotes.length).toBe(1);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const user = await getUser();
      const note = { text: 'text', public: false };
      await create(user, note);
      const createdNote = await findOne(note);

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
      const user = await getUser();
      const note = { text: 'text', public: false };
      await create(user, note);
      const createdNote = await findOne(note);

      const fakeOwner = 'foo';
      expect(fakeOwner).not.toBe(createdNote.owner);

      await update(
        user,
        { ...createdNote, owner: fakeOwner },
      );

      const updatedNote = await byId(user, { id: createdNote.id });

      expect(updatedNote.owner).toBe(createdNote.owner);
    });

    it('should not update notes of other users', async () => {
      const user = await getUser();
      const note = { text: 'text', public: false };
      await create(user, note);
      const createdNote = await findOne(note);

      const email2 = 'bar@example.com';
      const user2 = await getUser({ email: email2 });

      const newText = 'text2';
      expect(newText).not.toBe(createdNote.text);

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
      const user = await getUser();
      const note = { text: 'text', public: false };
      await create(user, note);
      const createdNote = await findOne({ ...note });

      expect((await byOwner(user)).length).toBe(1);

      await remove(user, createdNote);

      expect((await byOwner(user)).length).toBe(0);
    });

    it('should not remove notes of other users', async () => {
      const user = await getUser();
      const note = { text: 'text', public: false };
      await create(user, note);
      const createdNote = await findOne({ ...note });

      const email2 = 'bar@example.com';
      const user2 = await getUser({ email: email2 });

      expect((await byOwner(user)).length).toBe(1);

      await remove(user2, createdNote);

      expect((await byOwner(user)).length).toBe(1);
    });
  });
});
