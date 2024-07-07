jest.mock('../src/config', () => {
  const actual = jest.requireActual('../src/config');
  return {
    ...actual,
    CACHE_ENABLED: true,
    SECRET: actual.SECRET || 'shhhhh',
  };
});
