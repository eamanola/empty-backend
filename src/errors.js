const userNotFoundError = {
  status: 400,
  message: 'Login failed',
  name: 'userNotFoundError',
};

const invalidPasswordError = {
  status: 400,
  message: 'Login failed',
  name: 'invalidPasswordError',
};

const emailTakenError = {
  status: 400,
  message: 'Email already in use.',
  name: 'emailTakenError',
};

module.exports = {
  userNotFoundError,
  invalidPasswordError,
  emailTakenError,
};
