module.exports = {
  setupFiles: [
    './jest/jest.setup.config.js',
    './jest/jest.setup.mongodb-memory-server.js',
    './jest/jest.mock.cache.js',
  ],
  setupFilesAfterEnv: [
    './jest/jest.setup.db.js',
    './jest/jest.setup.cache.js',
  ],
};
