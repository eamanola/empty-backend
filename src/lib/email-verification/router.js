const express = require('express');

const errors = require('./errors');
const { requireUser, errorHandler } = require('../middlewares');
const requestVerification = require('./routes/request');
const verifyByLink = require('./routes/verify/by-link');
const verifyByCode = require('./routes/verify/by-code');

const router = express.Router();

router.get('/by-link', verifyByLink);

router.post('/request', requestVerification);

router.patch('/by-code', requireUser, verifyByCode);

router.use(errorHandler(errors, { defaultTo500: false }));

module.exports = router;
