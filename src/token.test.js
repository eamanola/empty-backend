const { encode, decode } = require('./token');

jest.mock('./config', () => ({ SECRET: 'shhhhh' }));

describe('token', () => {
  it('should hash object', () => {
    const data = 'foo';
    const token = encode(data);

    expect(token).toBeTruthy();
    expect(token).not.toBe(data);
  });

  it('should revert hash', () => {
    const data = 'foo';
    const token = encode(data);

    expect(decode(token)).toBe(data);
  });
});
