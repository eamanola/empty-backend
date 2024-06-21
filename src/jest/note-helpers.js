const validNote = ({ text = 'text', isPublic = false } = {}) => ({ text, isPublic });

module.exports = {
  validNote,
};
