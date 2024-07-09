const getToken = async (api, { email = 'foo@example.com', password = '123' } = {}) => {
  await api.post('/signup').send({ email, password });

  const { body } = await api.post('/login').send({ email, password });

  const { token } = body;

  return token;
};

const validNote = ({ isPublic = false, text = 'text' } = {}) => ({ isPublic, text });

const getNote = async (api, token, id, { BASE_URL = '/notes' } = {}) => {
  const { body } = (await api.get(`${BASE_URL}/${id}`).set({ Authorization: `bearer ${token}` }));

  const { note } = body;

  return note;
};

const createNote = async (api, token, { newNote = validNote(), BASE_URL = '/notes' } = {}) => {
  const { body } = (
    await api.post(BASE_URL).set({ Authorization: `bearer ${token}` }).send(newNote)
  );

  const { note } = body;
  return note;
};

module.exports = {
  createNote, getNote, getToken, validNote,
};
