require('dotenv').config();

const {
  MONGO_URL,
  SECRET,
  NODE_ENV,
  PORT = 3000,
} = process.env;

module.exports = {
  MONGO_URL,
  SECRET,
  NODE_ENV,
  PORT,
};
