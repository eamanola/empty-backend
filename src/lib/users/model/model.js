const { findOne, insertOne, updateOne } = require('../../db');

const userSchema = require('../validators/user');

const table = 'Users';

module.exports = {
  findOne: async (where) => {
    const result = await findOne(table, where);
    if (result) {
      return { ...result, emailVerified: !result.emailVerificationCode };
    }

    return result;
  },
  insertOne: async (user) => {
    await userSchema.validate(user);

    return insertOne(table, user);
  },
  table,
  updateOne: async (where, updates) => updateOne(table, where, updates),
};
