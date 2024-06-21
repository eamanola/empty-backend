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
  closeCache: CACHE_ENABLED ? closeCache : () => null,
  connectCache: CACHE_ENABLED ? connectCache : () => null,
  getItem: CACHE_ENABLED ? getItem : () => null,
  initCache: CACHE_ENABLED ? initCache : () => null,
  removeItem: CACHE_ENABLED ? removeItem : () => null,
  setItem: CACHE_ENABLED ? setItem : () => null,
};
