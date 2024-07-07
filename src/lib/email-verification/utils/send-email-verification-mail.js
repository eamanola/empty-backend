const { lookup } = require('node:dns/promises');
const os = require('node:os');

const logger = require('../../utils/logger');
const { PORT } = require('../config');

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
    const { address } = await lookup(os.hostname(), { family: 4 });
    logger.info(`http://${address}:${PORT}/email-verification?token=${token}`);
  }
};

module.exports = sendEmailVerificationMail;
