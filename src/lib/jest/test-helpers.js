const { deleteAll, count } = require('../db');
const userModel = require('../users/model');
const userController = require('../users/controllers');
const emailVerification = require('../users/controllers/email-verification');
const { setVerified, setUnverified } = require('../users/controllers/email-verification/set-status');
const errors = require('../errors');
const userErrors = require('../users/errors');

const deleteUsers = () => deleteAll(userModel.table);

const countUsers = (where) => count(userModel.table, where);

const findUser = async (where) => userModel.findOne(where);

const updateUser = async (where, updates) => userModel.updateOne(where, updates);

const createUser = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  const id = await userController.create({ email, password });

  return findUser({ id });
};

const setEmailStatus = ({ userId, verified }) => (verified === true
  ? setVerified(userId)
  : setUnverified(userId));

const getToken = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  const user = await createUser({ email, password });
  return { token: await userController.authenticate({ email, password }), user };
};

module.exports = {
  count,
  countUsers,
  createUser,
  deleteAll,
  deleteUsers,
  emailVerification,
  errors,
  findUser,
  getToken,
  login: userController.authenticate,
  setEmailStatus,
  signup: userController.create,
  updateUser,
  userErrors,
  userFromToken: userController.authorize,
};
