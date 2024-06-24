const emailNotVerifiedError = {
  message: 'Email Not Verified',
  name: 'emailNotVerifiedError',
  status: 400,
};

const emailTakenError = {
  message: 'Email already in use.',
  name: 'emailTakenError',
  status: 400,
};

const invalidPasswordError = {
  message: 'Login failed',
  name: 'invalidPasswordError',
  status: 400,
};

const sessionExipred = {
  message: 'Session Exipred',
  name: 'sessionExipred',
  status: 403,
};

const userNotFoundError = {
  message: 'User not found',
  name: 'userNotFoundError',
  status: 400,
};

module.exports = {
  emailNotVerifiedError,
  emailTakenError,
  invalidPasswordError,
  sessionExipred,
  userNotFoundError,
};
