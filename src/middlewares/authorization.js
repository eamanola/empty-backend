const { extractToken } = require('../utils/authorization');
const { userFromToken } = require('../controllers/login');

const authorization = async (req, res, next) => {
  let error = null;

  try {
    const token = extractToken(req.get('authorization'));
    const user = await userFromToken(token);

    req.user = user;
  } catch (e) {
    error = e;
  }

  next(error);
};

module.exports = authorization;
