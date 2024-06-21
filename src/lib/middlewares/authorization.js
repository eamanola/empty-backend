const { extractToken } = require('../utils/authorization');
const { authorize: userFromToken } = require('../controllers/users');

const authorization = async (req, res, next) => {
  let error = null;

  try {
    const token = extractToken(req.get('authorization'));
    const user = await userFromToken(token);

    req.user = user;
  } catch (err) {
    error = err;
  }

  next(error);
};

module.exports = authorization;
