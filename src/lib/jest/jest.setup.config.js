jest.mock('../../config', () => {
  const actual = jest.requireActual('../../config');
  return {
    ...actual,
    CACHE_ENABLED: true,
    SECRET: actual.SECRET || 'shhhhh',
  };
});
