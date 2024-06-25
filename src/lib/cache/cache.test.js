const cache = require('.');

describe('cache test', () => {
  const TEST_KEY = 'foo';
  afterEach(async () => {
    await cache.removeItem(TEST_KEY);
    expect(await cache.getItem(TEST_KEY)).toBeFalsy();
  });

  it('should set and get item', async () => {
    const obj = { bar: 1 };
    await cache.setItem(TEST_KEY, obj);
    expect(await cache.getItem(TEST_KEY)).toEqual(obj);

    const str = 'bar';
    await cache.setItem(TEST_KEY, str);
    expect(await cache.getItem(TEST_KEY)).toBe(str);

    const num = 1;
    await cache.setItem(TEST_KEY, num);
    expect(await cache.getItem(TEST_KEY)).toBe(num);

    const NULL = null;
    await cache.setItem(TEST_KEY, NULL);
    expect(await cache.getItem(TEST_KEY)).toBe(NULL);

    const UNDEFINED = undefined;
    await cache.setItem(TEST_KEY, UNDEFINED);
    // Redis returns null, instead of underined
    expect(await cache.getItem(TEST_KEY)).toBeFalsy();
  });

  it('should removeItem', async () => {
    const obj = { bar: 1 };
    await cache.setItem(TEST_KEY, obj);
    await cache.removeItem(TEST_KEY);
    expect(await cache.getItem(TEST_KEY)).toBeFalsy();
  });

  it('should remove list of items', async () => {
    const keys = ['foo', 'bar'];
    await cache.setItem(keys[0], 'foo');
    await cache.setItem(keys[1], 'bar');

    expect(await cache.getItem(keys[0])).toBe('foo');
    expect(await cache.getItem(keys[1])).toBe('bar');

    await cache.removeItem(keys);

    expect(await cache.getItem(keys[0])).toBeFalsy();
    expect(await cache.getItem(keys[1])).toBeFalsy();
  });
});
