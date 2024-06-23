const express = require('express');
const cors = require('cors');

const errors = require('./errors');
const userErrors = require('./users/errors');

const errorHandler = require('./middlewares/error-handler');
const authorization = require('./users/middlewares/authorization');

const {
  emailVerification,
  login,
  signup,
} = require('./users/routes');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/signup', signup);
app.post('/login', login);

app.use(authorization);

app.use('/email-verification', emailVerification);

const knownErrors = {
  ...errors,
  ...userErrors,
};

app.use(errorHandler(knownErrors));

module.exports = app;
