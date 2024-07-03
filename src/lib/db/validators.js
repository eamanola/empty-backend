const {
  array,
  bool,
  mixed,
  object,
  string,
} = require('yup');

const { supportedTypes } = require('./sqlite/utils/type-conversion');

const columnSchema = object().shape({
  default: mixed(),
  name: string().required(),
  required: bool(),
  type: mixed().oneOf(supportedTypes).required(),
  unique: bool(),
}).noUnknown().strict();

const tableSchema = object().shape({
  columns: array().min(1).of(columnSchema).required(),
  name: string().required(),
}).noUnknown().strict();

module.exports = {
  supportedTypes,
  tableSchema,
};
