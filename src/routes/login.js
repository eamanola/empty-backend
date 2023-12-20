const { login: controller } = require('../controllers/login');

const login = async (req, res, next) => {
  const { body } = req;

  try {
    const token = await controller(body);
    res.status(200).json({ message: 'OK', token });
  } catch (e) {
    next(e);
  }
};

module.exports = login;
