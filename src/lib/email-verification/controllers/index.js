const request = require('./request');
const verifyByCode = require('./verify/by-code');
const verifyByLink = require('./verify/by-link');
const setStatus = require('./set-status');

module.exports = {
  request,
  setStatus,
  verifyByCode,
  verifyByLink,
};
