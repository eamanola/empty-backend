const { deleteAll } = require('automata-db');

const { name: tableName } = require('../model/table');

const { isVerified, setUnverified, setVerified } = require('../controllers/set-status');

const createUser = async ({ email = 'foo@example.com' } = {}) => {
  const code = await setUnverified(email);
  return { code, email };
};

const getToken = async (api, { email = 'foo@example.com', password = 'supersec' } = {}) => {
  await api.post('/signup').send({ email, password });

  const { body } = await api.post('/login').send({ email, password });
  const { token } = body;

  return { email, token };
};

module.exports = {
  createUser,
  deleteAll: () => deleteAll(tableName),
  getToken,
  isVerified,
  setUnverified,
  setVerified,
};
