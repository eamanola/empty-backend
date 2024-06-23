const logger = require('../../utils/logger');

const sendEmailVerificationMail = async ({
  to,
  code,
  byCode,
  token,
}) => {
  logger.info('send email to', to);
  if (byCode) {
    logger.info(`${byCode}, with ${code}`);
  }
  if (token) {
    logger.info(`http://localhost:3000/email/verify/by-link?token=${token}`);
  }
};

module.exports = sendEmailVerificationMail;
