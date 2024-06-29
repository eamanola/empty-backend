jest.mock('../../config', () => {
  const actual = jest.requireActual('../../config');
  return {
    ...actual,
    CACHE_ENABLED: true,
    MONGO_URL: actual.MONGO_URL || 'use-mongodb-memory-server',
    REDIS_URL: actual.REDIS_URL || 'use-mock',
    SECRET: actual.SECRET || 'shhhhh',
  };
});
