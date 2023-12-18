const { deleteMany, count } = require('../db');
const { table: usersTable, findOne: findOneUser } = require('../models/users');
const { table: notesTable } = require('../models/notes');
const signup = require('../controllers/signup');

const deleteUsers = () => deleteMany(usersTable);
const deleteNotes = () => deleteMany(notesTable);

const countUsers = (filter) => count(usersTable, filter);
const countNotes = (filter) => count(notesTable, filter);

const createUser = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  await signup({ email, password });

  return findOneUser({ email });
};

const validNewNote = ({ text = 'text', isPublic = false } = {}) => ({ text, isPublic });

module.exports = {
  deleteUsers,
  deleteNotes,
  countUsers,
  countNotes,
  createUser,
  validNewNote,
};
