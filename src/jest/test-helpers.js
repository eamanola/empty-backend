const { deleteMany, count: countRows } = require('../db');
const { table: usersTable, findOne: findOneUser } = require('../models/users');
const { table: notesTable } = require('../models/notes');
const signup = require('../controllers/signup');

const deleteUsers = () => deleteMany(usersTable);
const deleteNotes = () => deleteMany(notesTable);

const countUsers = (filter) => countRows(usersTable, filter);
const countNotes = (filter) => countRows(notesTable, filter);

const createUser = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  await signup({ email, password });

  return findOneUser({ email });
};

const validNote = ({ text = 'text', isPublic = false } = {}) => ({ text, isPublic });

const APIgetToken = async ({
  api,
  email = 'foo@example.com',
  password = '123',
}) => {
  const credentials = { email, password };
  await api.post('/signup').send(credentials);
  const { token } = (await api.post('/login').send(credentials)).body;

  return token;
};

const APIcreateNote = async ({
  api,
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

const APIcreateNotes = async ({
  api,
  token,
  count,
  newNote = validNote(),
}) => {
  if (count > 0) {
    await APIcreateNote({ api, token, newNote });

    await APIcreateNotes({
      api,
      token,
      count: count - 1,
      newNote,
    });
  }
};

module.exports = {
  deleteUsers,
  deleteNotes,
  countUsers,
  countNotes,
  createUser,
  validNote,
  APIgetToken,
  APIcreateNote,
  APIcreateNotes,
};
