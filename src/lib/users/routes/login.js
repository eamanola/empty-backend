const { authenticate: controller } = require('../controllers');

const login = async (req, res, next) => {
  let error = null;

  const { body } = req;

  try {
    const { emailVerified, token } = await controller(body);
    res.status(200).json({ emailVerified, message: 'OK', token });
  } catch (err) {
    error = err;
  } finally {
    next(error);
  }
};

module.exports = login;
