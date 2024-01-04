const { initDB, connectDB, closeDB } = require('../db');

const SKIP_PATHS = [
  'src/db',
  'src/validators',
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

beforeEach(async () => {
  if (skip()) { return; }

  const { deleteUsers } = jest.requireActual('./test-helpers');
  await deleteUsers();
});
