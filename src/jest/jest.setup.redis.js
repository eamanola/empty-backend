const { initCache, connectCache, closeCache } = require('../cache');

jest.mock('redis', () => {
  const cache = {};

  const setItem = async (key, value) => {
    cache[key] = value;
  };

  const getItem = async (key) => cache[key];

  const removeItem = async (key) => {
    delete cache[key];
  };

  return {
    createClient: async () => ({
      get: getItem,
      set: setItem,
      del: removeItem,
      connect: async () => {},
      disconnect: async () => {},
    }),
  };
});

beforeAll(async () => {
  await initCache();
  await connectCache();
});

afterAll(async () => {
  await closeCache();
});
