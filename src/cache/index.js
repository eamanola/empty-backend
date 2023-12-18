const {
  initCache,
  connectCache,
  closeCache,

  getItem,
  setItem,
  removeItem,
} = require('./redis');

module.exports = {
  initCache,
  connectCache,
  closeCache,

  setItem,
  getItem,
  removeItem,
};
