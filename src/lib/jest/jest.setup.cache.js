const { initCache, connectCache, closeCache } = require('../cache');

beforeAll(async () => {
  await initCache();
  await connectCache();
});

afterAll(async () => {
  await closeCache();
});
