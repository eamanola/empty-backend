const { NODE_ENV } = require('../../config');
const { getItem, setItem, removeItem } = require('../cache');
const logger = require('../utils/logger');

const cacheKey = ({ user, url }) => `${user?.email || ''}${url}`;

const onFinish = (req, res, callback) => {
  const old = res.json;

  res.json = (body) => {
    old.call(res, body);

    callback(req, res, body);
  };
};

const cacheResult = async ( // req, res, body
  { user, originalUrl },
  { statusCode },
  body,
) => {
  if (statusCode === 200) {
    const key = cacheKey({ url: originalUrl, user });

    try {
      await setItem(key, { body, statusCode });
    } catch (err) {
      logger.info(err);
    }
  }
};

const invalidateCache = async ( // req, res
  { user, originalUrl, baseUrl },
  { statusCode },
) => {
  if (statusCode === 200 || statusCode === 201) {
    const key = cacheKey({ url: originalUrl, user });

    try {
      await removeItem(key);

      if (baseUrl !== originalUrl) {
        const key2 = cacheKey({ url: baseUrl, user });

        await removeItem(key2);
      }
    } catch (err) {
      logger.info(err);
    }
  }
};

const cache = async (req, res, next) => {
  let error = null;

  try {
    const method = req.method.toUpperCase();
    if (method === 'GET') {
      const { user, originalUrl } = req;
      const key = cacheKey({ url: originalUrl, user });
      const cached = await getItem(key);
      if (cached) {
        res.status(cached.statusCode).json(cached.body);
        logger.info('from cache');
        // TODO:
        return;
      } // else {
      onFinish(req, res, cacheResult);
      // }
    } else if (['POST', 'PUT', 'DELETE'].includes(method)) {
      onFinish(req, res, invalidateCache);
    }
  } catch (err) {
    error = err;
  }

  next(error);
};

module.exports = cache;

if (NODE_ENV === 'test') {
  module.exports.cacheKey = cacheKey;
}
