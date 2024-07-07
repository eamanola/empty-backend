const { initDB, connectDB, closeDB } = require('automata-db');

const { MONGO_URL, DB_ENGINE, SQLITE_FILE } = require('../src/config');

const SKIP_PATHS = [];
const { testPath } = expect.getState();
const skip = () => SKIP_PATHS.some((skipPath) => testPath.includes(skipPath));

const DB_URL = DB_ENGINE === 'mongo' ? MONGO_URL : SQLITE_FILE;

beforeAll(async () => {
  if (skip()) { return; }

  await initDB(DB_URL);
  await connectDB();
});

afterAll(async () => {
  if (skip()) { return; }

  await closeDB();
});
