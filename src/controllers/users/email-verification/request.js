const { emailVerifiedError, userNotFoundError } = require('../../../errors');
const { updateOne, findOne } = require('../../../models/users');
const sendEmailVerificationMail = require('../../../utils/send-email-verification-mail');
const { encode: encodeEmailVerificationToken } = require('../../../token');
const { info } = require('../../../logger');
const getCode = require('./get-code');

const request = async ({ email }, { byCode = null, byLink = null }) => {
  const user = await findOne({ email });
  if (!user) {
    throw userNotFoundError;
  }

  if (user.emailVerified) {
    throw emailVerifiedError;
  }

  const code = getCode();

  try {
    await updateOne({ id: user.id }, { emailVerificationCode: code });
  } catch (e) {
    info(e);
    throw e;
  }

  const token = byLink ? encodeEmailVerificationToken({ userId: user.id, byLink, code }) : null;

  sendEmailVerificationMail({
    to: user.email,
    code: byCode ? code : null,
    byCode,
    token,
  });
};

module.exports = request;
