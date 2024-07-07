require('dotenv').config();

const {
  AUTOMATA_DB_ENGINE = 'sqlite',
  MONGO_TEST_URL = 'use-mongodb-memory-server',
  MONGO_URL,
  NODE_ENV,
  PORT = 3000,
  REDIS_TEST_URL = 'use-mock',
  REDIS_URL,
  SECRET,
  // TODO:
  SQLITE_FILE = ':memory:',
  SQLITE_TEST_FILE = ':memory:',
} = process.env;

if (!['mongo', 'sqlite'].includes((AUTOMATA_DB_ENGINE || '').toLowerCase())) {
  throw new Error('DB_ENGINE should be one of: mongo, sqlite (default)');
}
module.exports = {
  CACHE_ENABLED: !!REDIS_URL,
  DB_ENGINE: AUTOMATA_DB_ENGINE.toLowerCase(),
  MONGO_URL: NODE_ENV === 'test' ? MONGO_TEST_URL : MONGO_URL,
  NODE_ENV,
  PORT,
  REDIS_URL: NODE_ENV === 'test' ? REDIS_TEST_URL : REDIS_URL,
  SECRET,
  SQLITE_FILE: NODE_ENV === 'test' ? SQLITE_TEST_FILE : SQLITE_FILE,
};
