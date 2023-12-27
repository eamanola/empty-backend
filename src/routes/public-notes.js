const { publicNotes: controller } = require('../controllers/notes');

const publicNotes = async (req, res, next) => {
  let error = null;

  try {
    const { limit, offset } = req.query;

    const notes = await controller({
      limit: Number(limit),
      offset: Number(offset),
    });
    res.status(200).json({ message: 'OK', notes });
  } catch (e) {
    error = e;
  } finally {
    next(error);
  }
};

module.exports = publicNotes;
