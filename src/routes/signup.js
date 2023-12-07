const controller = require('../controllers/signup');

const signup = async (req, res, next) => {
  const { body } = req;

  try {
    await controller(body);
    res.status(201).json({ message: 'OK' });
  } catch (e) {
    next(e);
  }
};

module.exports = signup;
