require('dotenv').config();

const {
  MONGO_URL,
  SECRET,
  NODE_ENV,
} = process.env;

module.exports = {
  MONGO_URL,
  SECRET,
  NODE_ENV,
};
