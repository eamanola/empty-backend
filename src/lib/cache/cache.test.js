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
});
