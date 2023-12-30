const restModel = require('./rest-model');

const validator = require('../validators/note');

const table = 'Notes';

const notesModel = restModel({ table, validator });

module.exports = notesModel;
