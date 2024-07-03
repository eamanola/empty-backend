const {
  bool,
  number,
  object,
  string,
} = require('yup');

const { tableSchema } = require('../validators');

const yupFromTable = async ({ columns, name: tableName }) => {
  await tableSchema.validate({ columns, name: tableName });

  return object().shape(
    columns.reduce((
      acc,
      {
        // default,
        name,
        required,
        type,
        // unique,
      },
    ) => {
      let validator;

      switch (type) {
        case 'string':
          validator = string();
          break;

        case 'number':
          validator = number();
          break;

        case 'bool':
          validator = bool();
          break;

        default:
          throw new Error('unsupported type');
      }

      if (required) {
        validator = validator.required();
      } else {
        validator = validator.nullable();
      }

      return { ...acc, [name]: validator };
    }, {}),
  ).noUnknown().strict();
};

module.exports = yupFromTable;
