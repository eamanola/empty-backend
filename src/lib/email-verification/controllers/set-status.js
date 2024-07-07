const { updateOne } = require('../../users/model');
const getCode = require('./get-code');

const setVerified = async (email) => updateOne({ email }, { emailVerificationCode: null });

const setUnverified = async (email) => {
  const emailVerificationCode = getCode();

  await updateOne({ email }, { emailVerificationCode });

  return emailVerificationCode;
};

module.exports = {
  setUnverified,
  setVerified,
};
