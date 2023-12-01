const {
  findOne,
  insertOne,
} = require('../db');

const userSchema = require('../validators/user');

const table = 'Users';

module.exports = {
  table,
  findOne: (criteria) => findOne(table, criteria),
  insertOne: async (user) => {
    await userSchema.validate(user);

    return insertOne(table, user);
  },
};
