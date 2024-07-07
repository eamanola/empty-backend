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

  it('should expire', () => {
    const data = 'foo';
    const secret = 'super-hush-hush';
    const token = encode(data, secret, { expiresIn: -1 });

    expect(token).toBeTruthy();
    try {
      decode(token, secret);
      expect('unreachable').toBe(true);
    } catch ({ message }) {
      expect(/expired/ui.test(message));
    }
  });
});
