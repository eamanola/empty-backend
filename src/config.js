require('dotenv').config();

const {
  MONGO_TEST_URL = 'use-mongodb-memory-server',
  MONGO_URL,
  NODE_ENV,
  PORT = 3000,
  REDIS_URL,
  SECRET,
} = process.env;

module.exports = {
  CACHE_ENABLED: !!REDIS_URL,
  MONGO_URL: NODE_ENV === 'test' ? MONGO_TEST_URL : MONGO_URL,
  NODE_ENV,
  PORT,
  REDIS_URL,
  SECRET,
};
