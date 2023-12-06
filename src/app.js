const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/error-handler');

const signup = require('./routes/signup');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/signup', signup);

app.use(errorHandler);

module.exports = app;
