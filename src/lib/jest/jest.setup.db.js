const { initDB, connectDB, closeDB } = require('../db');

const SKIP_PATHS = [
  'src/lib/db',
  'src/validators',
  'src/lib/validators',
];
const { testPath } = expect.getState();
const skip = () => SKIP_PATHS.some((skipPath) => testPath.includes(skipPath));

beforeAll(async () => {
  if (skip()) { return; }

  await initDB();
  await connectDB();
});

afterAll(async () => {
  if (skip()) { return; }

  await closeDB();
});
