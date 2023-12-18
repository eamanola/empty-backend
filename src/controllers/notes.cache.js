const { setItem, getItem, removeItem } = require('../cache');

const noteKey = ({ id: userId }, { id: noteId }) => `${userId}_${noteId}`;
const listKey = ({ id: userId }) => `${userId}_byOwner`;

const byId = async (user, note) => getItem(noteKey(user, note));
const cacheById = (user, note) => setItem(noteKey(user, note), note);

const byOwner = async (user) => getItem(listKey(user));
const cacheByOwner = async (user, notes) => setItem(listKey(user), notes);

const invalidateList = async (user) => {
  await removeItem(listKey(user));
};
const invalidateNote = async (user, note) => {
  await removeItem(noteKey(user, note));
  await invalidateList(user);
};

const onNoteCreated = async (user) => invalidateList(user);
const onNoteUpdated = async (user, note) => invalidateNote(user, note);
const onNoteRemoved = async (user, note) => invalidateNote(user, note);

module.exports = {
  byId,
  cacheById,
  byOwner,
  cacheByOwner,
  onNoteCreated,
  onNoteUpdated,
  onNoteRemoved,
};
