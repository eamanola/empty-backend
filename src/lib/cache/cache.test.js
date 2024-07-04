const cache = require('.');

describe('cache test', () => {
  const TEST_KEY = 'foo';
  afterEach(() => cache.removeItem(TEST_KEY));

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
    const value = 'val';

    await Promise.all(keys.map((key) => cache.setItem(key, value)));
    (await Promise.all(keys.map((key) => cache.getItem(key))))
      .forEach((val) => expect(val).toBe(value));

    await cache.removeItem(keys);

    (await Promise.all(keys.map((key) => cache.getItem(key))))
      .forEach((val) => expect(val).toBeFalsy());
  });
});
