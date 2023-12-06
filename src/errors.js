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

const validationError = {
  status: 400,
  name: 'ValidationError',
  // use yup for message
};

const unknownError = {
  status: 500,
  message: 'Something went wrong.',
  name: 'unknownError',
};

module.exports = {
  userNotFoundError,
  invalidPasswordError,
  emailTakenError,
  validationError,
  unknownError,
};
