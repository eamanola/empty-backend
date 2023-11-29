const {
  deleteMany,
  count,
  findOne,
  insertOne,
} = require('../db');

const userSchema = require('../validators/user');

module.exports = {
  deleteMany: (criteria) => deleteMany('Users', criteria),
  count: (criteria) => count('Users', criteria),
  findOne: (criteria) => findOne('Users', criteria),
  insertOne: async (user) => {
    await userSchema.validate(user);

    return insertOne('Users', user);
  },
};
