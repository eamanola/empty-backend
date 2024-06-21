const jwt = require('jsonwebtoken');

const { SECRET } = require('../../config');

const encode = (data) => jwt.sign(data, SECRET);
const decode = (token) => {
  const decoded = jwt.verify(token, SECRET);
  delete decoded.iat;
  return decoded;
};

module.exports = {
  decode,
  encode,
};
