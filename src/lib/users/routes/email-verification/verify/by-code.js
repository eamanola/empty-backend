const { emailVerification } = require('../../../controllers');

const { verifyByCode: controller } = emailVerification;

const verifyByCode = async (req, res, next) => {
  try {
    const { user } = req;
    const { code } = req.body;

    await controller(user, code);
    res.status(200).json({ message: 'OK' });
  } catch (err) {
    next(err);
  }
};

module.exports = verifyByCode;
