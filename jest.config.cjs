module.exports = {
  setupFilesAfterEnv: [
    './jest/jest.setup.config.js',
    './src/lib/email-verification/jest/jest.setup.config.js',
    './jest/jest.setup.mongodb-memory-server.js',
    './jest/jest.setup.db.js',
    './jest/jest.setup.redis.js',
    './jest/jest.setup.cache.js',
  ],
};
