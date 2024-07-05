require('dotenv').config();

const {
  DB_ENGINE = 'sqlite',
  MONGO_TEST_URL = 'use-mongodb-memory-server',
  MONGO_URL,
  NODE_ENV,
  PORT = 3000,
  REDIS_TEST_URL = 'use-mock',
  REDIS_URL,
  SECRET,
} = process.env;

if (!['mongo', 'sqlite'].includes((DB_ENGINE || '').toLowerCase())) {
  throw new Error('DB_ENGINE should be one of: mongo, sqlite (default)');
}
module.exports = {
  CACHE_ENABLED: !!REDIS_URL,
  DB_ENGINE: DB_ENGINE.toLowerCase(),
  MONGO_URL: NODE_ENV === 'test' ? MONGO_TEST_URL : MONGO_URL,
  NODE_ENV,
  PORT,
  REDIS_URL: NODE_ENV === 'test' ? REDIS_TEST_URL : REDIS_URL,
  SECRET,
};
