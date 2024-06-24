const express = require('express');
const cors = require('cors');
const { usersRouter, errorHandler } = require('./lib');

const app = express();

app.use(cors());
app.use(express.json());

app.use(usersRouter);

app.use(errorHandler);

module.exports = app;
