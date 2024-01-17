const { create: controller } = require('../controllers/users');

const signup = async (req, res, next) => {
  let error = null;

  const { body } = req;

  try {
    await controller(body);
    res.status(201).json({ message: 'OK' });
  } catch (e) {
    error = e;
  } finally {
    next(error);
  }
};

module.exports = signup;
