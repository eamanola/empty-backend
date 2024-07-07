const { utils } = require('automata-utils');

const { authorize: userFromToken } = require('../controllers');

const { extractToken } = utils;

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
