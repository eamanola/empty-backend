const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/error-handler');
const authorization = require('./middlewares/authorization');

const signup = require('./routes/signup');
const login = require('./routes/login');
const emailVerification = require('./routes/email-verification');

const { router: notes } = require('./routes/notes');
const publicNotes = require('./routes/public-notes');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/signup', signup);
app.post('/login', login);

app.use(authorization);

app.use('/email-verification', emailVerification);

app.use('/notes', notes);
app.get('/public-notes', publicNotes);

app.use(errorHandler);

module.exports = app;
