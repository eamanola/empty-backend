const { deleteAll, count } = require('../db');
const userModel = require('../users/model');
const userControllers = require('../users/controllers');
const errors = require('../errors');
const userErrors = require('../users/errors');

const deleteUsers = () => deleteAll(userModel.table);

const countUsers = (where) => count(userModel.table, where);

const findUser = async (where) => userModel.findOne(where);

const updateUser = async (where, updates) => userModel.updateOne(where, updates);

const createUser = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  const id = await userControllers.create({ email, password });

  return findUser({ id });
};

const setEmailStatus = ({ userId, verified }) => (verified === true
  ? userControllers.emailVerification.setStatus.setVerified(userId)
  : userControllers.emailVerification.setStatus.setUnverified(userId));

const getToken = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  const user = await createUser({ email, password });
  return { token: await userControllers.authenticate({ email, password }), user };
};

module.exports = {
  count,
  countUsers,
  createUser,
  deleteAll,
  deleteUsers,
  emailVerification: userControllers.emailVerification,
  errors,
  findUser,
  getToken,
  login: userControllers.authenticate,
  setEmailStatus,
  signup: userControllers.create,
  updateUser,
  userErrors,
  userFromToken: userControllers.authorize,
};
