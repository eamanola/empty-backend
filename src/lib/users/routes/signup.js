const { create: controller } = require('../controllers');

const signup = async (req, res, next) => {
  let error = null;

  const { body } = req;

  try {
    await controller(body);
    res.status(201).json({ message: 'OK' });
  } catch (err) {
    error = err;
  } finally {
    next(error);
  }
};

module.exports = signup;
