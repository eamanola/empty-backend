const {
  insertOne,
  findOne,
  find,
  replaceOne,
  deleteOne,
} = require('../models/notes');

const create = async (user, newNote) => insertOne({
  ...newNote,
  owner: user.id,
});

const byId = async (user, note) => findOne({
  id: note.id,
  owner: user.id,
});

const byOwner = (user) => find({ owner: user.id });

const update = (user, note) => replaceOne(
  { id: note.id, owner: user.id },
  { ...note, owner: user.id },
);

const remove = (user, note) => deleteOne({ id: note.id, owner: user.id });

module.exports = {
  create,
  byId,
  byOwner,
  update,
  remove,
};
