const supertest = require('supertest');
const express = require('express');

const { getItem, removeItem, setItem } = require('../cache');
const { cacheKey, cache } = require('./rest-cache');

const app = require('../../app');

const success = { message: 'ok' };

const router = express.Router();
router.use(cache);
router.use((req, res, next) => {
  if (req.get('fail')) {
    res.status(400).json({});
  } else next();
});
router.get('/:id', (req, res) => { res.status(200).json(success); });
router.get('/', (req, res) => { res.status(200).json(success); });
router.post('/', (req, res) => { res.status(201).json(success); });
router.put('/:id', (req, res) => { res.status(200).json(success); });
router.delete('/:id', (req, res) => { res.status(200).json(success); });

app.use('/test', router);

const api = supertest(app);

describe('cache middleware', () => {
  beforeEach(async () => {
    await removeItem('/test');
    await removeItem('/test/id');
  });

  describe('GET /:id', () => {
    it('should cache the results', async () => {
      const key = cacheKey({ url: '/test/id' });

      expect(await getItem(key)).toBeFalsy();

      await api.get('/test/id');

      expect((await getItem(key)).body).toEqual(success);
    });

    it('should not cache, if fail', async () => {
      const key = cacheKey({ url: '/test/id' });

      expect(await getItem(key)).toBeFalsy();

      await api.get('/test/id').set({ fail: 1 });

      expect(await getItem(key)).toBeFalsy();
    });

    it('should use a cached value, if available', async () => {
      const key = cacheKey({ url: '/test/id' });

      const cached = { statusCode: 234, body: 'foo' };
      expect(cached).not.toEqual(success);

      await setItem(key, cached);
      expect(await getItem(key)).toEqual(cached);

      const response = await api.get('/test/id');

      expect(response.statusCode).toEqual(cached.statusCode);
      expect(response.body).toEqual(cached.body);
    });
  });

  describe('GET /', () => {
    it('should cache the results', async () => {
      const key = cacheKey({ url: '/test' });

      expect(await getItem(key)).toBeFalsy();

      await api.get('/test');

      expect((await getItem(key)).body).toEqual(success);
    });

    it('should not cache, if fail', async () => {
      const key = cacheKey({ url: '/test' });

      expect(await getItem(key)).toBeFalsy();

      await api.get('/test').set({ fail: 1 });

      expect(await getItem(key)).toBeFalsy();
    });

    it('should use a cached value, if available', async () => {
      const key = cacheKey({ url: '/test' });

      const cached = { statusCode: 234, body: 'foo' };
      expect(cached).not.toEqual(success);

      await setItem(key, cached);
      expect(await getItem(key)).toEqual(cached);

      const response = await api.get('/test');

      expect(response.statusCode).toEqual(cached.statusCode);
      expect(response.body).toEqual(cached.body);
    });
  });

  describe('POST /', () => {
    it('should clear / cache', async () => {
      const key = cacheKey({ url: '/test' });

      await setItem(key, 'foo');
      expect(await getItem(key)).toBeTruthy();

      await api.post('/test');

      expect(await getItem(key)).toBeFalsy();
    });

    it('should not clear / cache, if fail', async () => {
      const key = cacheKey({ url: '/test' });

      await setItem(key, 'foo');
      expect(await getItem(key)).toBeTruthy();

      await api.post('/test').set({ fail: 1 });

      expect(await getItem(key)).toBe('foo');
    });
  });

  describe('PUT /', () => {
    it('should clear / cache & /:id cache', async () => {
      const key1 = cacheKey({ url: '/test' });
      const key2 = cacheKey({ url: '/test/id' });

      await setItem(key1, 'foo1');
      await setItem(key2, 'foo2');
      expect(await getItem(key1)).toBe('foo1');
      expect(await getItem(key2)).toBe('foo2');

      await api.put('/test/id');

      expect(await getItem(key1)).toBeFalsy();
      expect(await getItem(key2)).toBeFalsy();
    });

    it('should not clear / cache & /:id cache, if fail', async () => {
      const key1 = cacheKey({ url: '/test' });
      const key2 = cacheKey({ url: '/test/id' });

      await setItem(key1, 'foo1');
      await setItem(key2, 'foo2');
      expect(await getItem(key1)).toBe('foo1');
      expect(await getItem(key2)).toBe('foo2');

      await api.put('/test/id').set({ fail: 1 });

      expect(await getItem(key1)).toBe('foo1');
      expect(await getItem(key2)).toBe('foo2');
    });
  });

  describe('DELETE /', () => {
    it('should clear / cache & /:id cache', async () => {
      const key1 = cacheKey({ url: '/test' });
      const key2 = cacheKey({ url: '/test/id' });

      await setItem(key1, 'foo1');
      await setItem(key2, 'foo2');
      expect(await getItem(key1)).toBe('foo1');
      expect(await getItem(key2)).toBe('foo2');

      await api.delete('/test/id');

      expect(await getItem(key1)).toBeFalsy();
      expect(await getItem(key2)).toBeFalsy();
    });

    it('should not clear / cache & /:id cache, if fail', async () => {
      const key1 = cacheKey({ url: '/test' });
      const key2 = cacheKey({ url: '/test/id' });

      await setItem(key1, 'foo1');
      await setItem(key2, 'foo2');
      expect(await getItem(key1)).toBe('foo1');
      expect(await getItem(key2)).toBe('foo2');

      await api.delete('/test/id').set({ fail: 1 });

      expect(await getItem(key1)).toBe('foo1');
      expect(await getItem(key2)).toBe('foo2');
    });
  });
});
