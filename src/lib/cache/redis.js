const { createClient } = require('redis');

const { REDIS_URL } = require('../../config');

let client;

const initCache = async (url = REDIS_URL) => {
  client = createClient({ url });
};

const connectCache = async () => client.connect();
const closeCache = async () => client.disconnect();

const removeItem = async (key) => client.del(key);

const setItem = async (key, value, expiresInSeconds = 60 * 60 * 24) => {
  if (value === undefined) {
    return removeItem(key);
  }

  return client.set(key, JSON.stringify(value), { EX: expiresInSeconds });
};

const getItem = async (key) => {
  const cached = await client.get(key);

  return typeof cached === 'string' ? JSON.parse(cached) : cached;
};

module.exports = {
  closeCache,
  connectCache,
  getItem,
  initCache,
  removeItem,
  setItem,
};
