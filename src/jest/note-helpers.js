const validNote = ({ isPublic = false, text = 'text' } = {}) => ({ isPublic, text });

module.exports = {
  validNote,
};
