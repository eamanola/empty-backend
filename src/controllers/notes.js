const { createParamError } = require('../errors');

const { info } = require('../logger');

const {
  insertOne,
  findOne,
  find,
  replaceOne,
  deleteOne,
} = require('../models/notes');

const byId = async (user, note) => findOne({ id: note.id, owner: user.email });

const create = async (user, newNote) => {
  try {
    const { id } = await insertOne({ ...newNote, owner: user.email });

    return id;
  } catch (e) {
    if (e.name === 'ValidationError') {
      info(e.message);
      throw createParamError(e);
    }

    throw e;
  }
};

const byOwner = async (user) => find({ owner: user.email });

const update = async (user, note) => {
  try {
    await replaceOne(
      { id: note.id, owner: user.email },
      { ...note, owner: user.email },
    );
  } catch (e) {
    if (e.name === 'ValidationError') {
      info(e.message);
      throw createParamError(e);
    }

    throw e;
  }
};

const remove = async (user, note) => deleteOne({ id: note.id, owner: user.email });

const publicNotes = async ({ limit, offset } = {}) => find(
  { isPublic: true },
  { limit, offset },
);

module.exports = {
  create,
  byId,
  byOwner,
  update,
  remove,
  publicNotes,
};
