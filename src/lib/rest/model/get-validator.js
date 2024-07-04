const yupFromTable = require('../../db/utils/yup-from-table');

const { resourceSchema, userResourceSchema } = require('./validators');

const getValidator = async (table, { validator, userRequired }) => (
  (validator || await yupFromTable(table))
    .concat(userRequired ? userResourceSchema : resourceSchema)
);

module.exports = getValidator;
