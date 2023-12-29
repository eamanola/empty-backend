const model = require('../models/notes');

const restController = require('./rest-controller');

const controller = restController({ model });

const publicNotes = async ({ limit, offset } = {}) => model.find(
  { isPublic: true },
  { limit, offset },
);

module.exports = {
  ...controller,
  publicNotes,
};
