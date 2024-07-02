const {
  array,
  bool,
  mixed,
  object,
  string,
} = require('yup');

const columnSchema = object().shape({
  default: mixed(),
  name: string().required(),
  required: bool(),
  type: mixed().oneOf(['string', 'number', 'bool']).required(),
  unique: bool(),
}).noUnknown().strict();

const tableSchema = object().shape({
  schema: array().min(1).of(columnSchema),
  table: string().required(),
}).noUnknown().strict();

module.exports = {
  tableSchema,
};
