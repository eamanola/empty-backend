module.exports = {
  setupFilesAfterEnv: [
    './src/jest/jest.setup.mongodb-memory-server.js',
    './src/jest/jest.setup.config.js',
    './src/jest/jest.setup.redis.js',
  ],
};
