module.exports = {
  setupFilesAfterEnv: [
    './src/lib/jest/jest.setup.config.js',
    './src/lib/jest/jest.setup.mongodb-memory-server.js',
    './src/lib/jest/jest.setup.db.js',
    './src/lib/jest/jest.setup.redis.js',
    './src/lib/jest/jest.setup.cache.js',
  ],
};
