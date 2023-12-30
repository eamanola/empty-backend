const validator = require('../validators/note');

const restModel = require('../models/rest-model');
const restController = require('../controllers/rest-controller');
const restRouter = require('./rest-router');

const table = 'Notes';

const model = restModel(table, validator);
const controller = restController(model);
const router = restRouter(controller, {
  useCache: true,
  userRequired: true,
  resultKey: 'note',
  resultsKey: 'notes',
});

module.exports = {
  model,
  controller,
  router,
};
