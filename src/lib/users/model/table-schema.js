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

const indexes = [
  { columns: ['id'], name: 'idx-Users-id', unique: true },
  { columns: ['email'], name: 'idx-Users-email', unique: true },
];

const name = 'Users';

module.exports = {
  columns,
  indexes,
  name,
};
