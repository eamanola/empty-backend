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
      connect: async () => {},
      del: removeItem,
      disconnect: async () => {},
      get: getItem,
      set: setItem,
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
