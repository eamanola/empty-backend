const supertest = require('supertest');
const { model: userModel } = require('automata-user-management');
const { deleteAll, dropTable } = require('automata-db');
const { errors } = require('automata-utils');

const {
  createNote, getNote, getToken, validNote,
} = require('./note-helpers');
const { tableName, router } = require('./notes');
const app = require('../../../dist/index.bundle');

const BASE_URL = '/notes';
app.use(BASE_URL, router);
const api = supertest(app);

describe('/notes', () => {
  afterEach(async () => {
    await deleteAll(tableName);
    await deleteAll(userModel.tableName);
  });
  afterAll(() => dropTable(tableName));

  it('should throw accessDenied, if user missing', async () => {
    const { accessDenied } = errors;
    const response = await api.get(`${BASE_URL}/foo`);
    expect(response.status).toBe(accessDenied.status);
  });

  describe('POST /notes', () => {
    it('should create a note', async () => {
      const token = await getToken(api);
      const newNote = validNote();

      const response = await api
        .post(BASE_URL)
        .set({ Authorization: `bearer ${token}` })
        .send(newNote);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('CREATED');

      const { note } = response.body;
      expect(note).toEqual(expect.objectContaining(newNote));
      expect(note.id).toBeTruthy();
    });

    it('should throw paramError, on invalid params', async () => {
      const { paramError } = errors;
      const token = await getToken(api);
      const invalidNote = {};

      const response = await api
        .post(BASE_URL)
        .set({ Authorization: `bearer ${token}` })
        .send(invalidNote);

      expect(response.status).toBe(paramError.status);
      expect(response.body.note).toBeFalsy();
    });
  });

  describe('GET /notes/:id', () => {
    it('should return a note by id', async () => {
      const token = await getToken(api);
      const note = await createNote(api, token);

      const response = await api
        .get(`${BASE_URL}/${note.id}`)
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
      const token = await getToken(api);
      const token2 = await getToken(api, { email: 'foo2@other.com' });

      await createNote(api, token);
      await createNote(api, token);

      await createNote(api, token2);

      const { notes } = (await api.get(BASE_URL).set({ Authorization: `bearer ${token}` })).body;

      expect(notes.length).toBe(2);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should update a note', async () => {
      const token = await getToken(api);
      const inserted = await createNote(api, token);

      const modified = { ...inserted, text: 'foo' };
      expect(modified.text).not.toBe(inserted.text);

      const response = await api
        .put(`${BASE_URL}/${inserted.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modified);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');

      const { modified: timestamp, ...noteData } = modified;
      expect(response.body.note).toEqual(expect.objectContaining(noteData));

      const updatedNote = await getNote(api, token, inserted.id);
      expect(updatedNote.text).toBe(modified.text);
    });

    it('should throw paramError, on invalid params', async () => {
      const { paramError } = errors;
      const token = await getToken(api);
      const inserted = await createNote(api, token);

      const invalidNote = { ...inserted, text: '' };
      expect(invalidNote.text).not.toBe(inserted.text);

      const response = await api
        .put(`${BASE_URL}/${inserted.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(invalidNote);

      expect(response.status).toBe(paramError.status);

      const updatedNote = await getNote(api, token, inserted.id, token);
      expect(updatedNote).toEqual(expect.objectContaining(inserted));
    });

    it('should not update owner, or modified', async () => {
      const token = await getToken(api);
      const inserted = await createNote(api, token);

      const modified = { ...inserted, modified: 'bar', owner: 'foo' };
      expect(modified.owner).not.toBe(inserted.owner);
      expect(modified.modified).not.toBe(inserted.modified);

      await api
        .put(`/${BASE_URL}/${inserted.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modified);

      const updatedNote = await getNote(api, token, inserted.id);
      expect(updatedNote.owner).toBe(inserted.owner);
      expect(updatedNote.modified).not.toBe(modified.modified);
    });

    it('should not update id', async () => {
      const token = await getToken(api);
      const inserted = await createNote(api, token);

      const modified = {
        ...inserted,
        id: `ABCDE${inserted.id.substring(5)}`,
      };
      expect(modified.id).not.toBe(inserted.id);

      await api
        .put(`${BASE_URL}/${inserted.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modified);

      const updatedNote = await getNote(api, token, modified.id);
      expect(updatedNote).toBeFalsy();

      const original = await getNote(api, token, inserted.id);
      expect(original).toEqual(expect.objectContaining(inserted));
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should remove a note by id', async () => {
      const token = await getToken(api);
      const note = await createNote(api, token);

      const response = await api
        .delete(`${BASE_URL}/${note.id}`)
        .set({ Authorization: `bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');

      const deletedNote = await getNote(api, token, note.id);
      expect(deletedNote).toBeFalsy();
    });
  });
});
