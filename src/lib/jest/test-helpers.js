const { deleteAll, count } = require('../db');
const userModel = require('../users/model');
const userControllers = require('../users/controllers');
const emailVerification = require('../email-verification/controllers');

const countUsers = (where) => count(userModel.table, where);

const findUser = async (where) => userModel.findOne(where);

const createUser = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  const id = await userControllers.create({ email, password });

  return findUser({ id });
};

const deleteUsers = () => deleteAll(userModel.table);

const updateUser = async (where, updates) => userModel.updateOne(where, updates);

const setEmailStatus = ({ userId, verified }) => (verified === true
  ? emailVerification.setStatus.setVerified(userId)
  : emailVerification.setStatus.setUnverified(userId));

const getToken = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  const user = await createUser({ email, password });
  return { token: await userControllers.authenticate({ email, password }), user };
};

module.exports = {
  countUsers,
  createUser,
  deleteUsers,
  findUser,
  getToken,
  setEmailStatus,
  updateUser,
};
