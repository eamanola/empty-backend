const supertest = require('supertest');

const app = require('../app');

const { validNote, APIgetToken } = require('../jest/test-helpers');

const { fromToken: userFromToken } = require('../controllers/users');

const { paramError, accessDenied } = require('../errors');

const { deleteMany } = require('../db');

const { model } = require('./notes');

const api = supertest(app);

const getNote = async (id, token) => {
  const { note } = (
    await api
      .get(`/notes/${id}`)
      .set({ Authorization: `bearer ${token}` })
  ).body;

  return note;
};

const createNote = async ({
  token,
  newNote = validNote(),
}) => {
  const { note } = (
    await api
      .post('/notes')
      .set({ Authorization: `bearer ${token}` })
      .send(newNote)
  ).body;

  return note;
};

describe('/notes', () => {
  beforeEach(() => deleteMany(model.table, {}));

  it('should throw accessDenied, if user missing', async () => {
    const response = await api
      .get('/notes');

    expect(response.status).toBe(accessDenied.status);
    expect(response.body.message).toBe(accessDenied.message);
  });

  describe('POST /notes', () => {
    it('should create a note', async () => {
      const token = await APIgetToken({ api });
      const newNote = validNote();

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
      const token = await APIgetToken({ api });
      const invalidNote = {};

      const response = await api
        .post('/notes')
        .set({ Authorization: `bearer ${token}` })
        .send(invalidNote);

      expect(response.status).toBe(paramError.status);
      expect(response.body.note).toBeFalsy();
    });
  });

  describe('GET /notes/:id', () => {
    it('should return a note by id', async () => {
      const token = await APIgetToken({ api });
      const note = await createNote({ api, token });

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
      const token = await APIgetToken({ api });
      const token2 = await APIgetToken({ api, email: 'foo2@other.com' });

      await createNote({ api, token });
      await createNote({ api, token });

      await createNote({ api, token: token2 });

      const { notes } = (
        await api
          .get('/notes')
          .set({ Authorization: `bearer ${token}` })
      ).body;

      expect(notes.length).toBe(2);

      const user = await userFromToken(token);

      expect(notes.every(({ owner }) => owner === user.email)).toBe(true);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should update a note', async () => {
      const token = await APIgetToken({ api });
      const insertedNote = await createNote({ api, token });

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

      const updatedNote = await getNote(insertedNote.id, token);
      expect(updatedNote.text).toBe(modifiedNote.text);
    });

    it('should throw paramError, on invalid params', async () => {
      const token = await APIgetToken({ api });
      const insertedNote = await createNote({ api, token });

      const invalidNote = { ...insertedNote, text: '' };
      expect(invalidNote.text).not.toBe(insertedNote.text);

      const response = await api
        .put(`/notes/${insertedNote.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(invalidNote);

      expect(response.status).toBe(paramError.status);

      const updatedNote = await getNote(insertedNote.id, token);
      expect(updatedNote).toEqual(insertedNote);
    });

    it('should not update owner, or modified', async () => {
      const token = await APIgetToken({ api });
      const insertedNote = await createNote({ api, token });

      const modifiedNote = { ...insertedNote, owner: 'foo', modified: 'bar' };
      expect(modifiedNote.owner).not.toBe(insertedNote.owner);
      expect(modifiedNote.modified).not.toBe(insertedNote.modified);

      await api
        .put(`/notes/${insertedNote.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modifiedNote);

      const updatedNote = await getNote(insertedNote.id, token);
      expect(updatedNote.owner).toBe(insertedNote.owner);
      expect(updatedNote.modified).not.toBe(modifiedNote.modified);
    });

    it('should not update id', async () => {
      const token = await APIgetToken({ api });
      const insertedNote = await createNote({ api, token });

      const modifiedNote = {
        ...insertedNote,
        id: `ABCDE${insertedNote.id.substring(5)}`,
      };
      expect(modifiedNote.id).not.toBe(insertedNote.id);

      await api
        .put(`/notes/${insertedNote.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modifiedNote);

      const updatedNote = await getNote(modifiedNote.id, token);
      expect(updatedNote).toBeFalsy();

      const original = await getNote(insertedNote.id, token);
      expect(original).toEqual(insertedNote);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should remove a note by id', async () => {
      const token = await APIgetToken({ api });
      const note = await createNote({ api, token });

      const response = await api
        .delete(`/notes/${note.id}`)
        .set({ Authorization: `bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');

      const deletedNote = await getNote(note.id, token);
      expect(deletedNote).toBeFalsy();
    });
  });
});
