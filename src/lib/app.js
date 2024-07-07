const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { middlewares, errors } = require('automata-utils');

const usersRouter = require('./users/router');
const emailVerificationRouter = require('./email-verification/router');

const { NODE_ENV } = require('../config');

const { errorHandler } = middlewares;

const app = express();

app.use(cors({
  // TODO:
  origin: ['http://localhost:3000'],
}));
app.use(express.json());

if (NODE_ENV !== 'test') { app.use(morgan('tiny')); }

app.get('/health', (req, res) => { res.status(200).send('OK'); });

app.use(usersRouter);
app.use('/email-verification', emailVerificationRouter);

app.use(errorHandler(errors, { defaultTo500: true }));

module.exports = app;
