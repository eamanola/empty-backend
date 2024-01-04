const getCode = () => {
  const code = Math.floor(Math.random() * 1 * 1000 * 1000);
  return code > (100 * 1000) ? code : getCode();
};

const request = async (/* user, { byCode = null, byLink = null } */) => {

};

const verify = (/* token */) => {

};

module.exports = {
  getCode,
  request,
  verify,
};
