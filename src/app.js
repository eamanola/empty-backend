const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/error-handler');

const signup = require('./routes/signup');
const login = require('./routes/login');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/signup', signup);
app.post('/login', login);

app.use(errorHandler);

module.exports = app;
