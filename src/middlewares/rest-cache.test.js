const supertest = require('supertest');

const app = require('../app');

const {
  validNewNote,
  APIgetToken,
  APIcreateNote,
} = require('../jest/test-helpers');

const { accessDenied } = require('../errors');

const { userFromToken } = require('../controllers/login');
const { getItem, removeItem, setItem } = require('../cache');
const { cacheKey } = require('./rest-cache');

const api = supertest(app);

describe('/notes cache', () => {
  describe('GET /:id', () => {
    it('should cache the results', async () => {
      const token = await APIgetToken({ api });
      const note = await APIcreateNote({ api, token });
      const user = await userFromToken(token);
      const key = cacheKey({ user, url: `/notes/${note.id}` });

      await removeItem(key);
      expect(await getItem(key)).toBeFalsy();

      await api
        .get(`/notes/${note.id}`)
        .set({ Authorization: `bearer ${token}` });

      expect((await getItem(key)).body.note).toEqual(note);
    });

    it('should not cache, if fail', async () => {
      const token = await APIgetToken({ api });
      const note = await APIcreateNote({ api, token });
      const user = await userFromToken(token);
      const key = cacheKey({ user, url: `/notes/${note.id}` });

      await removeItem(key);
      expect(await getItem(key)).toBeFalsy();

      const response = await api
        .get(`/notes/${note.id}`);

      expect(response.status).toBe(accessDenied.status);
      expect(await getItem(key)).toBeFalsy();
    });

    it('should use a cached value, if available', async () => {
      const token = await APIgetToken({ api });
      const note = await APIcreateNote({ api, token });
      const user = await userFromToken(token);
      const key = cacheKey({ user, url: `/notes/${note.id}` });

      const cached = {
        statusCode: 234,
        body: { note: { ...note, text: 'foo', bar: 'baz' } },
      };

      expect(cached).not.toEqual(note);

      await setItem(key, cached);
      expect(await getItem(key)).toEqual(cached);

      const response = await api
        .get(`/notes/${note.id}`)
        .set({ Authorization: `bearer ${token}` });

      expect(response.statusCode).toEqual(cached.statusCode);
      expect(response.body.note).toEqual(cached.body.note);
    });
  });

  describe('GET /', () => {
    it('should cache the results', async () => {
      const token = await APIgetToken({ api });
      const note = await APIcreateNote({ api, token });
      const user = await userFromToken(token);
      const key = cacheKey({ user, url: '/notes' });

      await removeItem(key);
      expect(await getItem(key)).toBeFalsy();

      await api
        .get('/notes')
        .set({ Authorization: `bearer ${token}` });

      expect((await getItem(key)).body.notes[0]).toEqual(note);
    });

    it('should not cache, if fail', async () => {
      const token = await APIgetToken({ api });
      const user = await userFromToken(token);
      const key = cacheKey({ user, url: '/notes' });

      // TODO:
      await removeItem(key);

      expect(await getItem(key)).toBeFalsy();

      const response = await api
        .get('/notes');

      expect(response.status).toBe(accessDenied.status);
      expect(await getItem(key)).toBeFalsy();
    });

    it('should use a cached value, if available', async () => {
      const token = await APIgetToken({ api });
      const note = await APIcreateNote({ api, token });
      const user = await userFromToken(token);
      const key = cacheKey({ user, url: '/notes' });

      const cached = {
        statusCode: 234,
        body: { notes: [{ ...note, text: 'foo', bar: 'baz' }] },
      };
      await setItem(key, cached);
      expect(await getItem(key)).toEqual(cached);

      const response = await api
        .get('/notes')
        .set({ Authorization: `bearer ${token}` });

      expect(response.statusCode).toEqual(cached.statusCode);
      expect(response.body.notes[0]).toEqual(cached.body.notes[0]);
    });
  });

  describe('POST /notes', () => {
    it('should clear /notes cache', async () => {
      const token = await APIgetToken({ api });
      const user = await userFromToken(token);
      const key = cacheKey({ user, url: '/notes' });

      await setItem(key, 'foo');
      expect(await getItem(key)).toBeTruthy();

      await api
        .post('/notes')
        .set({ Authorization: `bearer ${token}` })
        .send(validNewNote());

      expect(await getItem(key)).toBeFalsy();
    });

    it('should not clear /notes cache, if fail', async () => {
      const token = await APIgetToken({ api });
      const user = await userFromToken(token);
      const key = cacheKey({ user, url: '/notes' });

      await setItem(key, 'foo');
      expect(await getItem(key)).toBeTruthy();

      const response = await api
        .post('/notes')
        .send(validNewNote());

      expect(response.status).toBe(accessDenied.status);
      expect(await getItem(key)).toBe('foo');
    });
  });

  describe('PUT /notes', () => {
    it('should clear /notes cache & /notes/:id cache', async () => {
      const token = await APIgetToken({ api });
      const user = await userFromToken(token);
      const note = await APIcreateNote({ api, token });
      const key1 = cacheKey({ user, url: '/notes' });
      const key2 = cacheKey({ user, url: `/notes/${note.id}` });

      const modified = { ...note, text: 'foo' };

      await setItem(key1, 'foo');
      await setItem(key2, 'foo');
      expect(await getItem(key1)).toBe('foo');
      expect(await getItem(key2)).toBe('foo');

      await api
        .put(`/notes/${note.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modified);

      expect(await getItem(key1)).toBeFalsy();
      expect(await getItem(key2)).toBeFalsy();
    });

    it('should not clear /notes cache & /notes/:id cache, if fail', async () => {
      const token = await APIgetToken({ api });
      const user = await userFromToken(token);
      const note = await APIcreateNote({ api, token });
      const key1 = cacheKey({ user, url: '/notes' });
      const key2 = cacheKey({ user, url: `/notes/${note.id}` });

      const modified = { ...note, text: 'foo' };

      await setItem(key1, 'foo');
      await setItem(key2, 'foo');
      expect(await getItem(key1)).toBe('foo');
      expect(await getItem(key2)).toBe('foo');

      const response = await api
        .put(`/notes/${note.id}`)
        .send(modified);

      expect(response.status).toBe(accessDenied.status);
      expect(await getItem(key1)).toBe('foo');
      expect(await getItem(key2)).toBe('foo');
    });
  });

  describe('DELETE /notes', () => {
    it('should clear /notes cache & /notes/:id cache', async () => {
      const token = await APIgetToken({ api });
      const user = await userFromToken(token);
      const note = await APIcreateNote({ api, token });
      const key1 = cacheKey({ user, url: '/notes' });
      const key2 = cacheKey({ user, url: `/notes/${note.id}` });

      await setItem(key1, 'foo');
      await setItem(key2, 'foo');
      expect(await getItem(key1)).toBe('foo');
      expect(await getItem(key2)).toBe('foo');

      await api
        .delete(`/notes/${note.id}`)
        .set({ Authorization: `bearer ${token}` });

      expect(await getItem(key1)).toBeFalsy();
      expect(await getItem(key2)).toBeFalsy();
    });

    it('should not clear /notes cache & /notes/:id cache, if fail', async () => {
      const token = await APIgetToken({ api });
      const user = await userFromToken(token);
      const note = await APIcreateNote({ api, token });
      const key1 = cacheKey({ user, url: '/notes' });
      const key2 = cacheKey({ user, url: `/notes/${note.id}` });

      const modified = { ...note, text: 'foo' };

      await setItem(key1, 'foo');
      await setItem(key2, 'foo');
      expect(await getItem(key1)).toBe('foo');
      expect(await getItem(key2)).toBe('foo');

      const response = await api
        .delete(`/notes/${note.id}`)
        .send(modified);

      expect(response.status).toBe(accessDenied.status);
      expect(await getItem(key1)).toBe('foo');
      expect(await getItem(key2)).toBe('foo');
    });
  });
});
