const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { usersRouter, errorHandler, errors } = require('./lib');
const { NODE_ENV } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());

if (NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}

app.get('/health', (req, res) => { res.status(200).send('OK'); });

app.use(usersRouter);

app.use(errorHandler(errors, { defaultTo500: true }));

module.exports = app;
