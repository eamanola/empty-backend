const { deleteAll, count } = require('../db');
const { table: usersTable, findOne: findOneUser } = require('../models/users');
const { signup, login } = require('../controllers/users');

const deleteUsers = () => deleteAll(usersTable);

const countUsers = (where) => count(usersTable, where);

const validNote = ({ text = 'text', isPublic = false } = {}) => ({ text, isPublic });

const findUser = async (where) => findOneUser(where);

const createUser = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  const id = await signup({ email, password });

  return findUser({ id });
};

const getToken = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  const user = await createUser({ email, password });
  return { user, token: await login({ email, password }) };
};

module.exports = {
  deleteUsers,
  countUsers,
  createUser,
  validNote,
  findUser,
  getToken,
};
