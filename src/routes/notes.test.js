const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
} = require('../db');
const app = require('../app');
const { table } = require('../models/notes');
const { findOne: findOneUser } = require('../models/users');
const { paramError } = require('../errors');
const { decode } = require('../token');

jest.mock('../config', () => {
  const actual = jest.requireActual('../config');
  return {
    ...actual,
    SECRET: 'shhhhh',
  };
});

const api = supertest(app);

let mongod;
let token;

const getToken = async (email = 'foo@example.com') => {
  const credentials = { email, password: '123' };
  await api.post('/signup').send(credentials);

  const { token: aToken } = (await api.post('/login').send(credentials)).body;

  return aToken;
};
describe('/notes', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    initDB(uri);
    await connectDB();
    token = await getToken();
  });

  afterAll(async () => {
    await closeDB();
    await mongod.stop();
  });

  beforeEach(() => deleteMany(table));

  describe('POST /notes', () => {
    it('should create a note', async () => {
      const newNote = { text: 'text', public: false };

      const response = await api
        .post('/notes')
        .set({ Authorization: `bearer ${token}` })
        .send(newNote);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('CREATED');

      const { note } = response.body;
      expect(note).toEqual(expect.objectContaining(newNote));
      expect(note.id).toBeTruthy();
    });

    it('should throw paramError, on invalid params', async () => {
      const invalidNewNote = {};

      const response = await api
        .post('/notes')
        .set({ Authorization: `bearer ${token}` })
        .send(invalidNewNote);

      expect(response.status).toBe(paramError.status);
      expect(response.body.note).toBeFalsy();
    });
  });

  describe('GET /notes/:id', () => {
    it('should return a note by id', async () => {
      const newNote = { text: 'text', public: false };

      const { id } = (
        await api
          .post('/notes')
          .set({ Authorization: `bearer ${token}` })
          .send(newNote)
      ).body.note;

      const response = await api
        .get(`/notes/${id}`)
        .set({ Authorization: `bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');
      expect(response.body.note)
        .toEqual(expect.objectContaining({ ...newNote, id }));
    });
  });

  describe('GET /notes', () => {
    it('should return all user notes', async () => {
      const newNote = { text: 'text', public: false };

      await api
        .post('/notes')
        .set({ Authorization: `bearer ${token}` })
        .send(newNote);

      await api
        .post('/notes')
        .set({ Authorization: `bearer ${token}` })
        .send(newNote);

      await api
        .post('/notes')
        .set({ Authorization: `bearer ${token}` })
        .send(newNote);

      const response = await api
        .get('/notes')
        .set({ Authorization: `bearer ${token}` });

      expect(response.body.notes.length).toBe(3);

      const user = await findOneUser(decode(token));

      expect(response.body.notes.every(({ owner }) => owner === user.id)).toBe(true);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should update a note', async () => {
      const newNote = { text: 'text', public: false };

      const { note: insertedNote } = (
        await api
          .post('/notes')
          .set({ Authorization: `bearer ${token}` })
          .send(newNote)
      ).body;

      const modifiedNote = { ...insertedNote, text: 'foo' };
      expect(modifiedNote.text).not.toBe(insertedNote.text);

      const response = await api
        .put(`/notes/${insertedNote.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modifiedNote);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');

      const { note: updatedNote } = (
        await api
          .get(`/notes/${insertedNote.id}`)
          .set({ Authorization: `bearer ${token}` })
      ).body;
      expect(updatedNote.text).toBe(modifiedNote.text);
    });

    it('should not update owner, or modified', async () => {
      const newNote = { text: 'text', public: false };

      const { note: insertedNote } = (
        await api
          .post('/notes')
          .set({ Authorization: `bearer ${token}` })
          .send(newNote)
      ).body;

      const modifiedNote = { ...insertedNote, owner: 'foo', modified: 'bar' };
      expect(modifiedNote.owner).not.toBe(insertedNote.owner);
      expect(modifiedNote.modified).not.toBe(insertedNote.modified);

      await api
        .put(`/notes/${insertedNote.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modifiedNote);

      const { note: updatedNote } = (
        await api
          .get(`/notes/${insertedNote.id}`)
          .set({ Authorization: `bearer ${token}` })
      ).body;

      expect(updatedNote.owner).toBe(insertedNote.owner);
      expect(updatedNote.modified).not.toBe(modifiedNote.modified);
    });

    it('should not update id', async () => {
      const newNote = { text: 'text', public: false };

      const { note: insertedNote } = (
        await api
          .post('/notes')
          .set({ Authorization: `bearer ${token}` })
          .send(newNote)
      ).body;

      const modifiedNote = {
        ...insertedNote,
        id: `ABCDE${insertedNote.id.substring(5)}`,
      };
      expect(modifiedNote.id).not.toBe(insertedNote.id);

      await api
        .put(`/notes/${insertedNote.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modifiedNote);

      const { note: updatedNote } = (
        await api
          .get(`/notes/${modifiedNote.id}`)
          .set({ Authorization: `bearer ${token}` })
      ).body;
      expect(updatedNote).toBeFalsy();

      const { note: original } = (
        await api
          .get(`/notes/${insertedNote.id}`)
          .set({ Authorization: `bearer ${token}` })
      ).body;
      expect(original).toEqual(insertedNote);
    });
  });
});
