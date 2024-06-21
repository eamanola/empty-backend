const controller = require('../controllers/public-notes');

const publicNotes = async (req, res, next) => {
  let error = null;

  try {
    const { limit, offset } = req.query;

    const notes = await controller({
      limit: Number(limit),
      offset: Number(offset),
    });
    res.status(200).json({ message: 'OK', notes });
  } catch (err) {
    error = err;
  } finally {
    next(error);
  }
};

module.exports = publicNotes;
