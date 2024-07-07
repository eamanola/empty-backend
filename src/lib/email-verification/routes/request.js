const controller = require('../controllers/request');

const request = async (req, res, next) => {
  try {
    const { email, byLink, byCode } = req.body;

    await controller(email, { byCode, byLink });

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    next(err);
  }
};

module.exports = request;
