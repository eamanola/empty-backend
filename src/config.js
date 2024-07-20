require('dotenv').config();

const {
  AUTOMATA_DB_ENGINE = 'sqlite',
  MONGO_TEST_URL = ':memory:',
  MONGO_URL,
  NODE_ENV,
  PORT = 3000,
  REDIS_TEST_URL = ':memory:',
  REDIS_URL,
  SECRET,
  // TODO:
  SQLITE_FILE = ':memory:',
  SQLITE_TEST_FILE = ':memory:',
} = process.env;

const IS_TEST = NODE_ENV === 'test';

const DB_ENGINE = (AUTOMATA_DB_ENGINE || '').toLowerCase();
if (!['mongo', 'sqlite'].includes(DB_ENGINE)) {
  throw new Error('DB_ENGINE should be one of: mongo, sqlite (default)');
}

const MONGO = IS_TEST ? MONGO_TEST_URL : MONGO_URL;
const SQLITE = IS_TEST ? SQLITE_TEST_FILE : SQLITE_FILE;

const DB_URL = DB_ENGINE === 'mongo' ? MONGO : SQLITE;

module.exports = {
  DB_URL,
  NODE_ENV,
  PORT,
  REDIS_URL: IS_TEST ? REDIS_TEST_URL : REDIS_URL,
  SECRET,
};

if (IS_TEST) {
  module.exports.DB_ENGINE = DB_ENGINE;
}
