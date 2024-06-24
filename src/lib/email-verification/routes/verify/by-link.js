const controller = require('../../controllers/verify/by-link');

const verifyByLink = async (req, res, next) => {
  try {
    const { token } = req.query;

    const redirectTo = await controller(token);
    res.redirect(301, redirectTo);
  } catch (err) {
    next(err);
  }
};

module.exports = verifyByLink;
