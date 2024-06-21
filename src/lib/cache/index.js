const { CACHE_ENABLED } = require('../../config');

const {
  initCache,
  connectCache,
  closeCache,

  getItem,
  setItem,
  removeItem,
} = require('./redis');

module.exports = {
  initCache: CACHE_ENABLED ? initCache : () => null,
  connectCache: CACHE_ENABLED ? connectCache : () => null,
  closeCache: CACHE_ENABLED ? closeCache : () => null,

  setItem: CACHE_ENABLED ? setItem : () => null,
  getItem: CACHE_ENABLED ? getItem : () => null,
  removeItem: CACHE_ENABLED ? removeItem : () => null,
};
