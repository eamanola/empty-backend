const { deleteAll } = require('automata-db');

const { name: tableName } = require('../model/table');

const { isVerified, setUnverified, setVerified } = require('../controllers/set-status');

const createUser = async ({ email = 'foo@example.com' } = {}) => {
  const code = await setUnverified(email);
  return { code, email };
};

module.exports = {
  createUser,
  deleteAll: () => deleteAll(tableName),
  isVerified,
  setUnverified,
  setVerified,
};
