const validator = require('../validators/note');

const restModel = require('../lib/models/rest-model');
const restController = require('../lib/controllers/rest-controller');
const restRouter = require('../lib/routes/rest-router');

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
