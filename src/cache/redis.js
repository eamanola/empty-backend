const { createClient } = require('redis');

const { REDIS_URL } = require('../config');

let client;

const initCache = async (url = REDIS_URL) => {
  client = await createClient({ url });
};

const connectCache = async () => client.connect();
const closeCache = async () => client.disconnect();

const setItem = async (key, value, expiresInSeconds = 60 * 60 * 24) => {
  await client.set(key, JSON.stringify(value), { EX: expiresInSeconds });
};

const getItem = async (key) => {
  const cached = await client.get(key);

  return cached !== undefined ? JSON.parse(cached) : undefined;
};

const removeItem = async (key) => {
  await client.del(key);
};

module.exports = {
  initCache,
  connectCache,
  closeCache,

  setItem,
  getItem,
  removeItem,
};
