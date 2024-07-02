const { randomUUID } = require('node:crypto');
const { NODE_ENV } = require('../../../config');
const {
  createTable,
  findOne,
  insertOne,
  updateOne,
} = require('../../db');

const userSchema = require('../validators/user');

const { table, schema } = require('./schema');

// name to avoid dublicates
const createUsersTable = async () => createTable(table, schema);
createUsersTable();

module.exports = {
  findOne: async (where) => {
    const result = await findOne(table, where);
    if (result) {
      return { ...result, emailVerified: !result.emailVerificationCode };
    }

    return result;
  },
  insertOne: async (newUser) => {
    const user = { ...newUser, id: randomUUID() };
    await userSchema.validate(user);

    await insertOne(table, user);

    return { id: user.id };
  },
  table,
  updateOne: async (where, updates) => updateOne(table, where, updates),
};

if (NODE_ENV === 'test') {
  module.exports.createTable = createUsersTable;
}
