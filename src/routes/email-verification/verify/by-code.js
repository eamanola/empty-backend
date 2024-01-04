const { verifyByCode: controller } = require('../../../controllers/users/email-verification');

const verifyByCode = async (req, res, next) => {
  try {
    const { user } = req;
    const { code } = req.body;

    await controller(user, code);
    res.status(200).json({ message: 'OK' });
  } catch (e) {
    next(e);
  }
};

module.exports = verifyByCode;
