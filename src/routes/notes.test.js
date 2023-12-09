const supertest = require('supertest');

const {
  startTestDB,
  stopTestDB,
  deleteNotes,
} = require('../test-helper.test');

const app = require('../app');

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

let token;

const getToken = async (email = 'foo@example.com') => {
  const credentials = { email, password: '123' };
  await api.post('/signup').send(credentials);

  const { token: aToken } = (await api.post('/login').send(credentials)).body;

  return aToken;
};

const createNote = async ({ text = 'text' } = {}) => {
  const newNote = { text, public: false };

  const { note } = (
    await api
      .post('/notes')
      .set({ Authorization: `bearer ${token}` })
      .send(newNote)
  ).body;

  return note;
};

const getNote = async (id) => {
  const { note } = (
    await api
      .get(`/notes/${id}`)
      .set({ Authorization: `bearer ${token}` })
  ).body;

  return note;
};

describe('/notes', () => {
  beforeAll(async () => {
    await startTestDB();

    token = await getToken();
  });

  afterAll(stopTestDB);

  beforeEach(deleteNotes);

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
      const note = await createNote();

      const response = await api
        .get(`/notes/${note.id}`)
        .set({ Authorization: `bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');

      const { modified, ...noteData } = note;
      expect(response.body.note)
        .toEqual(expect.objectContaining({ ...noteData }));
    });
  });

  describe('GET /notes', () => {
    it('should return all user notes', async () => {
      const TIMES = 3;
      const promises = [];
      for (let i = 0; i < TIMES; i += 1) {
        promises.push(createNote());
      }
      await Promise.all(promises);

      const { notes } = (
        await api
          .get('/notes')
          .set({ Authorization: `bearer ${token}` })
      ).body;

      expect(notes.length).toBe(TIMES);

      const user = await findOneUser(decode(token));

      expect(notes.every(({ owner }) => owner === user.email)).toBe(true);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should update a note', async () => {
      const insertedNote = await createNote();

      const modifiedNote = { ...insertedNote, text: 'foo' };
      expect(modifiedNote.text).not.toBe(insertedNote.text);

      const response = await api
        .put(`/notes/${insertedNote.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modifiedNote);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');

      const { modified, ...noteData } = modifiedNote;
      expect(response.body.note).toEqual(expect.objectContaining(noteData));

      const updatedNote = await getNote(insertedNote.id);
      expect(updatedNote.text).toBe(modifiedNote.text);
    });

    it('should throw paramError, on invalid params', async () => {
      const insertedNote = await createNote();

      const invalidNote = { ...insertedNote, text: '' };
      expect(invalidNote.text).not.toBe(insertedNote.text);

      const response = await api
        .put(`/notes/${insertedNote.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(invalidNote);

      expect(response.status).toBe(paramError.status);

      const updatedNote = await getNote(insertedNote.id);
      expect(updatedNote).toEqual(insertedNote);
    });

    it('should not update owner, or modified', async () => {
      const insertedNote = await createNote();

      const modifiedNote = { ...insertedNote, owner: 'foo', modified: 'bar' };
      expect(modifiedNote.owner).not.toBe(insertedNote.owner);
      expect(modifiedNote.modified).not.toBe(insertedNote.modified);

      await api
        .put(`/notes/${insertedNote.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modifiedNote);

      const updatedNote = await getNote(insertedNote.id);
      expect(updatedNote.owner).toBe(insertedNote.owner);
      expect(updatedNote.modified).not.toBe(modifiedNote.modified);
    });

    it('should not update id', async () => {
      const insertedNote = await createNote();

      const modifiedNote = {
        ...insertedNote,
        id: `ABCDE${insertedNote.id.substring(5)}`,
      };
      expect(modifiedNote.id).not.toBe(insertedNote.id);

      await api
        .put(`/notes/${insertedNote.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modifiedNote);

      const updatedNote = await getNote(modifiedNote.id);
      expect(updatedNote).toBeFalsy();

      const original = await getNote(insertedNote.id);
      expect(original).toEqual(insertedNote);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should remove a note by id', async () => {
      const note = await createNote();

      const response = await api
        .delete(`/notes/${note.id}`)
        .set({ Authorization: `bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');

      const deletedNote = await getNote(note.id);
      expect(deletedNote).toBeFalsy();
    });
  });
});
