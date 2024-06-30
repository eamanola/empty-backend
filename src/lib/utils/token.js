const jwt = require('jsonwebtoken');

const decode = (token, secret) => {
  const decoded = jwt.verify(token, secret);
  delete decoded.iat;
  return decoded;
};
const encode = (data, secret) => jwt.sign(data, secret);

module.exports = {
  decode,
  encode,
};
