const { initDB, connectDB, closeDB } = require('automata-db');

const { DB_URL } = require('../src/config');

beforeAll(async () => {
  await initDB(DB_URL);
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});
