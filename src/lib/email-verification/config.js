require('dotenv').config();

const {
  EMAIL_VERIFICATION_SECRET,
  PORT = 3000,
} = process.env;

module.exports = {
  EMAIL_VERIFICATION_SECRET,
  PORT,
};
