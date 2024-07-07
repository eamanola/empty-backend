jest.mock('../config', () => {
  const actual = jest.requireActual('../config');
  return {
    ...actual,
    EMAIL_VERIFICATION_SECRET: actual.EMAIL_VERIFICATION_SECRET || 'shhhhh',
  };
});
