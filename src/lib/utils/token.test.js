const { encode, decode } = require('./token');

describe('token', () => {
  it('should hash object', () => {
    const data = 'foo';
    const secret = 'super-hush-hush';
    const token = encode(data, secret);

    expect(token).toBeTruthy();
    expect(token).not.toBe(data);
  });

  it('should revert hash', () => {
    const data = 'foo';
    const secret = 'super-hush-hush';

    const token = encode(data, secret);

    expect(decode(token, secret)).toBe(data);
  });
});
