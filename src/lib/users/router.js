const express = require('express');
const userErrors = require('./errors');
const { emailVerification, login, signup } = require('./routes');
const { authorization } = require('./middlewares');
const { errorHandler } = require('../middlewares');

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.use(authorization);
router.use('/email-verification', emailVerification);
router.use(errorHandler(userErrors, { defaulTo500: false }));

module.exports = router;
