const supertest = require('supertest');

const app = require('../app');

const { validNewNote } = require('../jest/test-helpers');

const api = supertest(app);

const getToken = async (email = 'foo@example.com') => {
  const credentials = { email, password: '123' };
  await api.post('/signup').send(credentials);

  const { token: aToken } = (await api.post('/login').send(credentials)).body;

  return aToken;
};

const createNotes = async ({ isPublic }, count, token) => {
  if (count > 0) {
    await api
      .post('/notes')
      .set({ Authorization: `bearer ${token}` })
      .send(validNewNote({ isPublic }));

    await createNotes({ isPublic }, count - 1, token);
  }
};

describe('GET /public-notes', () => {
  it('should return public notes', async () => {
    const token = await getToken();
    const PRIVATE_LIMIT = 20;
    await createNotes({ isPublic: false }, PRIVATE_LIMIT, token);

    const PUBLIC_LIMIT = 10;
    expect(PUBLIC_LIMIT > 0);
    await createNotes({ isPublic: true }, PUBLIC_LIMIT, token);

    const response = await api.get('/public-notes');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('OK');
    expect(response.body.notes.length).toBe(PUBLIC_LIMIT);
    expect(response.body.notes.every(({ isPublic }) => isPublic === true)).toBe(true);
  });

  describe('limit option', () => {
    it('should should limit results, if limit is less than all count', async () => {
      const token = await getToken();
      const PUBLIC_LIMIT = 10;
      await createNotes({ isPublic: true }, PUBLIC_LIMIT, token);

      const LIMIT_BELOW = 3;
      expect(LIMIT_BELOW < PUBLIC_LIMIT);

      const { notes } = (await api.get(`/public-notes?limit=${LIMIT_BELOW}`)).body;
      expect(notes.length).toBe(LIMIT_BELOW);
    });
    it('should return all, if limit is greater than all count', async () => {
      const token = await getToken();
      const PUBLIC_LIMIT = 10;
      await createNotes({ isPublic: true }, PUBLIC_LIMIT, token);

      const LIMIT_ABOVE = 13;
      expect(LIMIT_ABOVE > PUBLIC_LIMIT);

      const { notes } = (await api.get(`/public-notes?limit=${LIMIT_ABOVE}`)).body;
      expect(notes.length < LIMIT_ABOVE).toBe(true);
      expect(notes.length).toBe(PUBLIC_LIMIT);
    });
    it('should have no effect, if invalid', async () => {
      const token = await getToken();
      const PUBLIC_LIMIT = 10;
      await createNotes({ isPublic: true }, PUBLIC_LIMIT, token);

      const LIMIT_INVALID = 'foo';
      expect(Number.isNaN(Number(LIMIT_INVALID))).toBe(true);

      const { notes } = (await api.get(`/public-notes?limit=${LIMIT_INVALID}`)).body;
      expect(notes.length).toBe(PUBLIC_LIMIT);
    });
  });

  describe('offset option', () => {
    it('should skip spesified offset', async () => {
      const token = await getToken();
      const PUBLIC_LIMIT = 10;
      await createNotes({ isPublic: true }, PUBLIC_LIMIT, token);

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
      const token = await getToken();
      const PUBLIC_LIMIT = 10;
      await createNotes({ isPublic: true }, PUBLIC_LIMIT, token);

      const OFFSET = 30;
      expect(OFFSET > PUBLIC_LIMIT);

      const { notes } = (await api.get(`/public-notes?offset=${OFFSET}`)).body;
      expect(notes.length).toBe(0);
    });

    it('should have no effect, if invalid', async () => {
      const token = await getToken();
      const PUBLIC_LIMIT = 10;
      await createNotes({ isPublic: true }, PUBLIC_LIMIT, token);

      const INVALID_OFFSET = 'foo';
      expect(Number.isNaN(Number(INVALID_OFFSET))).toBe(true);

      const { notes } = (await api.get(`/public-notes?offset=${INVALID_OFFSET}`)).body;
      expect(notes.length).toBe(PUBLIC_LIMIT);
    });
  });
});
