const { findOne, insertOne, updateOne } = require('../model');
const getCode = require('./get-code');

const isVerified = async (email) => {
  const { code } = await findOne(email);

  return code === null;
};

const setVerified = async (email) => updateOne(email, null);

const setUnverified = async (email) => {
  const code = getCode();

  const oldRequest = await findOne(email);

  if (oldRequest) {
    await updateOne(email, code);
  } else {
    await insertOne(email, code);
  }

  return code;
};

module.exports = {
  isVerified,
  setUnverified,
  setVerified,
};
