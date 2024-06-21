const { authenticate: controller } = require('../controllers/users');

const login = async (req, res, next) => {
  let error = null;

  const { body } = req;

  try {
    const token = await controller(body);
    res.status(200).json({ message: 'OK', token });
  } catch (err) {
    error = err;
  } finally {
    next(error);
  }
};

module.exports = login;
