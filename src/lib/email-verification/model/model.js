const {
  createTable,
  findOne,
  insertOne,
  updateOne,
} = require('automata-db');

const table = require('./table');
const validator = require('./validator');

createTable(table);

const model = {
  findOne: async (email) => findOne(table.name, { email }),
  insertOne: async (email, code) => {
    await validator.validate({ code, email });

    return insertOne(table.name, { code, email });
  },
  updateOne: async (email, code) => updateOne(table.name, { email }, { code }),
};

module.exports = model;
