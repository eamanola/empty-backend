const { getItem, setItem, removeItem } = require('../cache');
const { log, info } = require('../logger');

const cacheKey = ({ user, url }) => `${user?.email || ''}${url}`;

const onFinish = (req, res, callback) => {
  const old = res.json;

  res.json = (data) => {
    old.call(res, data);

    callback(req, res, data);
  };
};

const cacheResult = async (req, res, data) => {
  const { statusCode } = res;

  if (statusCode === 200) {
    const { user, originalUrl } = req;
    const key = cacheKey({ user, url: originalUrl });

    try {
      await setItem(key, { statusCode, body: data });
    } catch (e) {
      log(e);
    }
  }
};

const invalidateCache = async (req, res) => {
  const { statusCode } = res;

  if (statusCode === 200 || statusCode === 201) {
    const { user, originalUrl, baseUrl } = req;
    const key = cacheKey({ user, url: originalUrl });

    await removeItem(key);

    if (baseUrl !== originalUrl) {
      const key2 = cacheKey({ user, url: baseUrl });

      try {
        await removeItem(key2);
      } catch (e) {
        log(e);
      }
    }
  }
};

const cache = async (req, res, next) => {
  let error = null;

  try {
    const method = req.method.toUpperCase();
    if (method === 'GET') {
      const { user, originalUrl } = req;
      const key = cacheKey({ user, url: originalUrl });
      const cached = await getItem(key);
      if (cached) {
        res.status(cached.statusCode).json(cached.body);
        info('from cache');
        // TODO:
        return;
      } // else {
      onFinish(req, res, cacheResult);
      // }
    } else if (['POST', 'PUT', 'DELETE'].includes(method)) {
      onFinish(req, res, invalidateCache);
    }
  } catch (e) {
    error = e;
  }

  next(error);
};

module.exports = { cache, cacheKey };
