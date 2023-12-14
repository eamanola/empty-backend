const { publicNotes: controller } = require('../controllers/notes');

const publicNotes = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;

    const notes = await controller({
      limit: Number(limit),
      offset: Number(offset),
    });
    res.status(200).json({ message: 'OK', notes });
  } catch (e) {
    next(e);
  }
};

module.exports = publicNotes;
