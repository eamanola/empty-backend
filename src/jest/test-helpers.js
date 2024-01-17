const { deleteAll, count } = require('../db');
const userModel = require('../models/users');
const userController = require('../controllers/users');
const emailVerification = require('../controllers/users/email-verification');
const { setVerified, setUnverified } = require('../controllers/users/email-verification/set-status');
const errors = require('../errors');

const deleteUsers = () => deleteAll(userModel.table);

const countUsers = (where) => count(userModel.table, where);

const validNote = ({ text = 'text', isPublic = false } = {}) => ({ text, isPublic });

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
  return { user, token: await userController.authenticate({ email, password }) };
};

module.exports = {
  deleteUsers,
  countUsers,
  createUser,
  validNote,
  findUser,
  updateUser,
  getToken,
  signup: userController.create,
  login: userController.authenticate,
  userFromToken: userController.authorize,
  emailVerification,
  setEmailStatus,
  deleteAll,
  count,
  errors,
};
