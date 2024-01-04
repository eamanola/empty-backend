const getCode = require('./get-code');
const request = require('./request');
const verifyByCode = require('./verify/by-code');
const verifyByLink = require('./verify/by-link');

module.exports = {
  getCode,
  request,
  verifyByCode,
  verifyByLink,
};
