const getCode = require('./get-code');

describe('getCode', () => {
  it('should be an integer between 100000 and 1000000', () => {
    const code = getCode();
    expect(code > 100000).toBe(true);
    expect(code < 1000000).toBe(true);
    expect(Math.floor(code)).toBe(code);
  });
});
