const supertest = require('supertest');

const app = require('../app');

const { validNewNote, APIgetToken, APIcreateNotes } = require('../jest/test-helpers');

const api = supertest(app);

describe('GET /public-notes', () => {
  it('should return public notes', async () => {
    const token = await APIgetToken({ api });
    const PRIVATE_LIMIT = 20;
    await APIcreateNotes({
      api,
      token,
      newNote: validNewNote({ isPublic: false }),
      count: PRIVATE_LIMIT,
    });

    const PUBLIC_LIMIT = 10;
    expect(PUBLIC_LIMIT > 0);
    await APIcreateNotes({
      api,
      token,
      newNote: validNewNote({ isPublic: true }),
      count: PUBLIC_LIMIT,
    });

    const response = await api.get('/public-notes');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('OK');
    expect(response.body.notes.length).toBe(PUBLIC_LIMIT);
    expect(response.body.notes.every(({ isPublic }) => isPublic === true)).toBe(true);
  });

  describe('limit option', () => {
    it('should should limit results, if limit is less than all count', async () => {
      const token = await APIgetToken({ api });
      const PUBLIC_LIMIT = 10;
      await APIcreateNotes({
        api,
        token,
        newNote: validNewNote({ isPublic: true }),
        count: PUBLIC_LIMIT,
      });

      const LIMIT_BELOW = 3;
      expect(LIMIT_BELOW < PUBLIC_LIMIT);

      const { notes } = (await api.get(`/public-notes?limit=${LIMIT_BELOW}`)).body;
      expect(notes.length).toBe(LIMIT_BELOW);
    });
    it('should return all, if limit is greater than all count', async () => {
      const token = await APIgetToken({ api });
      const PUBLIC_LIMIT = 10;
      await APIcreateNotes({
        api,
        token,
        newNote: validNewNote({ isPublic: true }),
        count: PUBLIC_LIMIT,
      });

      const LIMIT_ABOVE = 13;
      expect(LIMIT_ABOVE > PUBLIC_LIMIT);

      const { notes } = (await api.get(`/public-notes?limit=${LIMIT_ABOVE}`)).body;
      expect(notes.length < LIMIT_ABOVE).toBe(true);
      expect(notes.length).toBe(PUBLIC_LIMIT);
    });
    it('should have no effect, if invalid', async () => {
      const token = await APIgetToken({ api });
      const PUBLIC_LIMIT = 10;
      await APIcreateNotes({
        api,
        token,
        newNote: validNewNote({ isPublic: true }),
        count: PUBLIC_LIMIT,
      });

      const LIMIT_INVALID = 'foo';
      expect(Number.isNaN(Number(LIMIT_INVALID))).toBe(true);

      const { notes } = (await api.get(`/public-notes?limit=${LIMIT_INVALID}`)).body;
      expect(notes.length).toBe(PUBLIC_LIMIT);
    });
  });

  describe('offset option', () => {
    it('should skip spesified offset', async () => {
      const token = await APIgetToken({ api });
      const PUBLIC_LIMIT = 10;
      await APIcreateNotes({
        api,
        token,
        newNote: validNewNote({ isPublic: true }),
        count: PUBLIC_LIMIT,
      });

      const OFFSET = 3;
      expect(OFFSET < PUBLIC_LIMIT);

      const { notes } = (await api.get(`/public-notes?offset=${OFFSET}`)).body;
      expect(notes.length).toBe(PUBLIC_LIMIT - OFFSET);

      const { notes: allPublicNotes } = (await api.get('/public-notes')).body;

      for (let i = 0; i < PUBLIC_LIMIT - OFFSET; i += 1) {
        expect(notes[i]).toEqual(allPublicNotes[i + OFFSET]);
      }
    });

    it('should return no results, if offset is greater than all count', async () => {
      const token = await APIgetToken({ api });
      const PUBLIC_LIMIT = 10;
      await APIcreateNotes({
        api,
        token,
        newNote: validNewNote({ isPublic: true }),
        count: PUBLIC_LIMIT,
      });

      const OFFSET = 30;
      expect(OFFSET > PUBLIC_LIMIT);

      const { notes } = (await api.get(`/public-notes?offset=${OFFSET}`)).body;
      expect(notes.length).toBe(0);
    });

    it('should have no effect, if invalid', async () => {
      const token = await APIgetToken({ api });
      const PUBLIC_LIMIT = 10;
      await APIcreateNotes({
        api,
        token,
        newNote: validNewNote({ isPublic: true }),
        count: PUBLIC_LIMIT,
      });

      const INVALID_OFFSET = 'foo';
      expect(Number.isNaN(Number(INVALID_OFFSET))).toBe(true);

      const { notes } = (await api.get(`/public-notes?offset=${INVALID_OFFSET}`)).body;
      expect(notes.length).toBe(PUBLIC_LIMIT);
    });
  });
});
