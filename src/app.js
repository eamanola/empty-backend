const express = require('express');
const cors = require('cors');
const addMiddlewares = require('./lib/add-middlewares');

const app = express();

app.use(cors());
app.use(express.json());

addMiddlewares(app);

module.exports = app;
