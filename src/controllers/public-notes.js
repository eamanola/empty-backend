const model = require('../models/notes');

const publicNotes = async ({ limit, offset } = {}) => model.find(
  { isPublic: true },
  { limit, offset },
);

module.exports = publicNotes;
