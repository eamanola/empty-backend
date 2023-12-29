const restRouter = require('./rest-router');
const controller = require('../controllers/notes');

const router = restRouter({
  controller,
  useCache: true,
  userRequired: true,
  resultKey: 'note',
  resultsKey: 'notes',
});

module.exports = router;
