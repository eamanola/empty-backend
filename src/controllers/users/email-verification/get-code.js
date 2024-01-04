const getCode = () => {
  const code = Math.floor(Math.random() * 1 * 1000 * 1000);
  return code > (100 * 1000) ? code : getCode();
};

module.exports = getCode;
