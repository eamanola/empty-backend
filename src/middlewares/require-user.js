const { accessDenied } = require('../errors');

const requireUser = (req, res, next) => {
  if (!req.user) {
    next(accessDenied);
  } else {
    next();
  }
};

module.exports = requireUser;
