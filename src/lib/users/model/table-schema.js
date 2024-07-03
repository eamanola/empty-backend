// schema, ordered list : [{
//   name: string,
//   type: 'string'|'number'|'bool',
//   required?: bool,
//   default?: value,
//   unique?: bool,
// }]

const name = 'Users';
const columns = [
  {
    name: 'email',
    required: true,
    type: 'string',
    unique: true,
  },
  { name: 'emailVerificationCode', type: 'number' },
  {
    name: 'id',
    required: true,
    type: 'string',
    unique: true,
  },
  { name: 'passwordHash', required: true, type: 'string' },
];

module.exports = {
  columns,
  name,
};
