const jwt = require('jsonwebtoken');

const { SECRET } = require('./config');

const encode = (data) => jwt.sign(data, SECRET);
const decode = (token) => jwt.verify(token, SECRET);

module.exports = {
  encode,
  decode,
};
