const { upsert, deleteOne, findOne } = require('../db');

const unverifiedEmailsSchema = require('../validators/unverified-emails');

const table = 'unverified-emails';

module.exports = {
  table,
  upsert: async ({ userId, newEmail }) => {
    await unverifiedEmailsSchema.validate({ userId, newEmail });

    return upsert(table, { userId }, { newEmail });
  },
  deleteOne: ({ userId }) => deleteOne(table, { userId }),
  findOne: ({ userId }) => findOne(table, { userId }),
};
