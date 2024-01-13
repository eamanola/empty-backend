const { updateOne } = require('../../../models/users');
const getCode = require('./get-code');

const setVerified = async (userId) => updateOne({ id: userId }, { emailVerificationCode: null });

const setUnverified = async (userId) => {
  const emailVerificationCode = getCode();

  await updateOne({ id: userId }, { emailVerificationCode });

  return emailVerificationCode;
};

module.exports = {
  setUnverified,
  setVerified,
};
