const { createParamError } = require('../errors');

const { info } = require('../logger');

const {
  insertOne,
  findOne,
  find,
  replaceOne,
  deleteOne,
} = require('../models/notes');

const {
  byId: fromCacheById,
  cacheById,
  byOwner: fromCacheByOwner,
  cacheByOwner,
  onNoteCreated,
  onNoteUpdated,
  onNoteRemoved,
} = require('./notes.cache');

const byId = async (user, note) => {
  const fromCache = await fromCacheById(user, note);
  if (fromCache) return fromCache;

  const fromDb = await findOne({ id: note.id, owner: user.email });
  if (fromDb) {
    await cacheById(user, fromDb);
  }

  return fromDb;
};

const create = async (user, newNote) => {
  try {
    const { id } = await insertOne({ ...newNote, owner: user.email });
    await onNoteCreated(user);

    return id;
  } catch (e) {
    if (e.name === 'ValidationError') {
      info(e.message);
      throw createParamError(e);
    }

    throw e;
  }
};

const byOwner = async (user) => {
  const fromCache = await fromCacheByOwner(user);
  if (fromCache) return fromCache;

  const fromDb = await find({ owner: user.email });
  if (fromDb) {
    await cacheByOwner(user, fromDb);
  }

  return fromDb;
};

const update = async (user, note) => {
  try {
    await replaceOne(
      { id: note.id, owner: user.email },
      { ...note, owner: user.email },
    );
    await onNoteUpdated(user, note);
  } catch (e) {
    if (e.name === 'ValidationError') {
      info(e.message);
      throw createParamError(e);
    }

    throw e;
  }
};

const remove = async (user, note) => {
  await deleteOne({ id: note.id, owner: user.email });
  await onNoteRemoved(user, note);
};

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
