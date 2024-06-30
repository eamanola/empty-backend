jest.mock('../../config', () => {
  const actual = jest.requireActual('../../config');
  return {
    ...actual,
    CACHE_ENABLED: true,
    REDIS_URL: actual.REDIS_URL || 'use-mock',
    SECRET: actual.SECRET || 'shhhhh',
  };
});
