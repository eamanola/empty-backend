const express = require('express');
const cors = require('cors');
const { usersRouter, errorHandler, errors } = require('./lib');

const app = express();

app.use(cors());
app.use(express.json());

app.use(usersRouter);

app.use(errorHandler(errors, { defaultTo500: true }));

module.exports = app;
