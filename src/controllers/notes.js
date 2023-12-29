const model = require('../models/notes');

const restController = require('./rest-controller');

const controller = restController({ model });

module.exports = controller;
