const { router: restRouter } = require('automata-rest');

const { NODE_ENV } = require('../../config');

const tableName = 'test-notes';

const columns = [
  { name: 'imageUrl', type: 'string' },
  { name: 'isPublic', required: true, type: 'bool' },
  { name: 'text', required: true, type: 'string' },
];

const indexes = [{ columns: ['isPublic'], name: `idx-${tableName}-isPublic` }];

const table = { columns, indexes, name: tableName };

const router = restRouter(null, {
  resultKey: 'note',
  resultsKey: 'notes',
  table,
  useCache: true,
  userRequired: true,
});

module.exports = { router };

if (NODE_ENV === 'test') {
  module.exports.tableName = tableName;
}
