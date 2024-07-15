const cache = require('automata-cache');

describe('automata-cache', () => {
  it('should save, retrive, and remove values', async () => {
    const TEST_KEY = 'foo';
    const val = 'bar';

    await cache.setItem(TEST_KEY, val);

    expect(await cache.getItem(TEST_KEY)).toBe(val);

    await cache.removeItem(TEST_KEY);

    expect(await cache.getItem(TEST_KEY)).toBeFalsy();
  });
});
