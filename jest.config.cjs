module.exports = {
  setupFilesAfterEnv: [
    './jest/jest.setup.config.js',
    './jest/jest.setup.mongodb-memory-server.js',
    './jest/jest.setup.db.js',
    './src/lib/cache/jest.setup.redis.js',
    './src/lib/cache/jest.setup.cache.js',
  ],
};
