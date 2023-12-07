const controller = require('../controllers/signup');

const signup = async (req, res, next) => {
  const { body } = req;

  try {
    const { status, json } = await controller(body);
    res.status(status).json(json);
  } catch (e) {
    next(e);
  }
};

module.exports = signup;
