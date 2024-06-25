const { REDIS_URL } = require('../../config');

if (REDIS_URL === 'use-mock') {
  jest.mock('../cache/redis', () => {
    const cache = {};

    const setItem = async (key, value) => {
      cache[key] = value;
    };

    const getItem = async (key) => cache[key];

    const removeItem = async (key) => {
      delete cache[key];
    };

    return {
      closeCache: () => null,
      connectCache: () => null,
      getItem,
      initCache: () => null,
      removeItem,
      setItem,
    };
  });
}
