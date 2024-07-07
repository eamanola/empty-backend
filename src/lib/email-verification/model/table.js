const columns = [
  {
    name: 'email',
    required: true,
    type: 'string',
    unique: true,
  },
  { name: 'code', type: 'number' },
];

const indexes = [
  { columns: ['email'], name: 'idx-email-verification-email', unique: true },
];

const name = 'email-verification';

module.exports = {
  columns,
  indexes,
  name,
};
