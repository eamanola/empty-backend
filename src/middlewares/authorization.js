const { accessDenied } = require('../errors');
const { decode } = require('../token');
const { findOne } = require('../models/users');

const getToken = (req) => {
  const auth = req.get('authorization');

  const token = (
    auth
    && auth.toLowerCase().startsWith('bearer ')
  )
    ? auth.substring(7)
    : null;

  return token;
};

const getUser = (token) => !!token && findOne(decode(token));

const authorization = async (req, res, next) => {
  let error;

  try {
    const token = getToken(req);
    const user = await getUser(token);

    req.user = user;
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      error = accessDenied;
    } else {
      error = e;
    }
  }

  next(error);
};

module.exports = authorization;
