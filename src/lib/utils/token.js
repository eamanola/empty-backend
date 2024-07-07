const jwt = require('jsonwebtoken');

const decode = (token, secret) => {
  const decoded = jwt.verify(token, secret);
  const { data } = decoded;
  return data;
};
const encode = (data, secret, { expiresIn } = {}) => jwt.sign(
  { data },
  secret,
  expiresIn ? { expiresIn } : {},
);

module.exports = {
  decode,
  encode,
};
