const { log } = require('./logger');

const sendEmailVerificationMail = async ({
  to,
  code,
  byCode,
  token,
}) => {
  log('send email to', to);
  if (byCode) {
    log(`${byCode}, with ${code}`);
  }
  if (token) {
    log(`http://localhost:3000/email/verify/by-link?token=${token}`);
  }
};

module.exports = sendEmailVerificationMail;
