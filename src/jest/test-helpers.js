const { deleteMany, count: countRows } = require('../db');
const { table: usersTable, findOne: findOneUser } = require('../models/users');
const signup = require('../controllers/signup');

const deleteUsers = () => deleteMany(usersTable);

const countUsers = (filter) => countRows(usersTable, filter);

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

module.exports = {
  deleteUsers,
  countUsers,
  createUser,
  validNote,
  APIgetToken,
};
