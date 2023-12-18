const cache = {};

const setItem = async (key, value) => {
  cache[key] = value;
};

const getItem = async (key) => cache[key];

const removeItem = async (key) => {
  delete cache[key];
};

module.exports = {
  setItem,
  getItem,
  removeItem,
};
