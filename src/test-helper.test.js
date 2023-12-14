const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  initDB,
  connectDB,
  closeDB,
  deleteMany,
  count,
} = require('./db');
const { table: usersTable, findOne: findOneUser } = require('./models/users');
const { table: notesTable } = require('./models/notes');
const signup = require('./controllers/signup');

let mongod;

const startTestDB = async () => {
  mongod = await MongoMemoryServer.create();

  initDB(mongod.getUri());

  await connectDB();
};

const stopTestDB = async () => {
  await closeDB();
  await mongod.stop();
};

const deleteUsers = () => deleteMany(usersTable);
const deleteNotes = () => deleteMany(notesTable);

const countUsers = (filter) => count(usersTable, filter);
const countNotes = (filter) => count(notesTable, filter);

const createUser = async ({ email = 'foo@example.com', password = '123' } = {}) => {
  await signup({ email, password });

  return findOneUser({ email });
};

const validNewNote = ({ text = 'text', isPublic = false } = {}) => ({ text, isPublic });

test('hide from linter.test', () => {
  expect(true).toBe(true);
});

module.exports = {
  startTestDB,
  stopTestDB,
  deleteUsers,
  deleteNotes,
  countUsers,
  countNotes,
  createUser,
  validNewNote,
};
