describe('CACHE_ENABLED flag', () => {
  it('should enable cache, if truthy', async () => {
    // eslint-disable-next-line global-require
    const { CACHE_ENABLED } = require('../../config');
    expect(CACHE_ENABLED).toBe(true);

    // eslint-disable-next-line global-require
    const { getItem, setItem } = require('./index');

    const data = 'foo';
    const key = 'bar';
    expect(data).toBeTruthy();

    await setItem(key, data);
    const cached = await getItem(key);

    expect(cached).toBe(data);
  });

  it('should disable(noop) cache, if falsy', async () => {
    // removes redis mocks, run this test last
    jest.resetModules();
    jest.doMock('../../config', () => ({ CACHE_ENABLED: false }));

    // eslint-disable-next-line global-require
    const { CACHE_ENABLED } = require('../../config');
    expect(CACHE_ENABLED).toBe(false);

    // eslint-disable-next-line global-require
    const { getItem, setItem } = require('./index');

    const data = 'foo';
    const key = 'bar';
    expect(data).toBeTruthy();

    await setItem(key, data);
    const cached = await getItem(key);

    expect(cached).not.toBe(data);
    expect(cached).toBeFalsy();
  });
});
