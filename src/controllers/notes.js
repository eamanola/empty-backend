const { createParamError } = require('../errors');

const {
  insertOne,
  findOne,
  find,
  replaceOne,
  deleteOne,
} = require('../models/notes');

const byId = async (user, note) => findOne({
  id: note.id,
  owner: user.id,
});

const create = async (user, newNote) => {
  try {
    const { id } = await insertOne({ ...newNote, owner: user.id });
    return byId(user, { id });
  } catch (e) {
    if (e.name === 'ValidationError') {
      throw createParamError(e);
    }

    throw e;
  }
};

const byOwner = (user) => find({ owner: user.id });

const update = async (user, note) => {
  try {
    await replaceOne(
      { id: note.id, owner: user.id },
      { ...note, owner: user.id },
    );
  } catch (e) {
    if (e.name === 'ValidationError') {
      throw createParamError(e);
    }

    throw e;
  }
};

const remove = (user, note) => deleteOne({ id: note.id, owner: user.id });

module.exports = {
  create,
  byId,
  byOwner,
  update,
  remove,
};
