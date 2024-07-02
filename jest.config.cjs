module.exports = {
  setupFilesAfterEnv: [
    './src/lib/jest/jest.setup.config.js',
    './src/lib/db/mongo/jest.setup.mongodb-memory-server.js',
    './src/lib/db/jest.setup.db.js',
    './src/lib/jest/jest.setup.redis.js',
    './src/lib/jest/jest.setup.cache.js',
  ],
};
