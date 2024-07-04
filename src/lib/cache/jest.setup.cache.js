const { initCache, connectCache, closeCache } = require('.');

beforeAll(async () => {
  await initCache();
  await connectCache();
});

afterAll(async () => {
  await closeCache();
});
