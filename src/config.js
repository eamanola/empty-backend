require('dotenv').config();

const {
  MONGO_URL,
  SECRET,
} = process.env;

module.exports = {
  MONGO_URL,
  SECRET,
};
