const { request: controller } = require('../../controllers/users/email-verification');

const request = async (req, res, next) => {
  try {
    const {
      email,
      byLink,
      byCode,
    } = req.body;

    await controller({ email }, { byCode, byLink });
    res.status(200).json({ message: 'OK' });
  } catch (e) {
    next(e);
  }
};

module.exports = request;
