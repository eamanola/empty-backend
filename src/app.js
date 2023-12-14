const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/error-handler');
const authorization = require('./middlewares/authorization');
const requireUser = require('./middlewares/require-user');

const signup = require('./routes/signup');
const login = require('./routes/login');
const notes = require('./routes/notes');
const publicNotes = require('./routes/public-notes');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/signup', signup);
app.post('/login', login);
app.get('/public-notes', publicNotes);

app.use(authorization);

app.use('/notes', requireUser, notes);

app.use(errorHandler);

module.exports = app;
