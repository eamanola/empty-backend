const express = require('express');
const { middlewares } = require('automata-utils');

const userErrors = require('./errors');
const { login, signup } = require('./routes');
const { authorization } = require('./middlewares');

const { errorHandler } = middlewares;

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.use(authorization);

router.use(errorHandler(userErrors, { defaultTo500: false }));

module.exports = router;
