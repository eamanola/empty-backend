const express = require('express');

const { requireUser } = require('../../../middlewares');

const requestVerification = require('./request');
const verifyByLink = require('./verify/by-link');
const verifyByCode = require('./verify/by-code');

const router = express.Router();

router.get('/by-link', verifyByLink);

router.post('/request', requestVerification);

router.patch('/by-code', requireUser, verifyByCode);

module.exports = router;
