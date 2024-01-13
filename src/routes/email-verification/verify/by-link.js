const { verifyByLink: controller } = require('../../../controllers/users/email-verification');

const verifyByLink = async (req, res, next) => {
  try {
    const { token } = req.query;

    const redirectTo = await controller(token);
    res.redirect(301, redirectTo);
  } catch (e) {
    next(e);
  }
};

module.exports = verifyByLink;
