const { deleteAll, count } = require('automata-db');
const userModel = require('../users/model');
const userControllers = require('../users/controllers');
const emailVerification = require('../email-verification/controllers');

const countUsers = (where) => count(userModel.tableName, where);

const findUser = async (where) => userModel.findOne(where);

const createUser = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  await userControllers.create({ email, password });

  return findUser({ email });
};

const deleteUsers = () => deleteAll(userModel.tableName);

const updateUser = async (where, updates) => userModel.updateOne(where, updates);

const setEmailStatus = ({ userId, verified }) => (verified === true
  ? emailVerification.setStatus.setVerified(userId)
  : emailVerification.setStatus.setUnverified(userId));

const getToken = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  const user = await createUser({ email, password });
  const { token } = await userControllers.authenticate({ email, password });
  return { token, user };
};

const validTableSchema = () => ({
  columns: [
    { name: 'bool', type: 'bool' },
    { name: 'date', type: 'date' },
    { name: 'object', type: 'object' },
    { name: 'number', type: 'number' },
    { name: 'required', required: true, type: 'string' },
    { name: 'string', type: 'string' },
  ],
  indexes: [
    { columns: ['bool', 'required'], name: 'bool-required', unique: true },
    { columns: ['required'], name: 'required', unique: true },
  ],
  name: 'table-name',
});

module.exports = {
  countUsers,
  createUser,
  deleteUsers,
  findUser,
  getToken,
  setEmailStatus,
  updateUser,
  validTableSchema,
};
