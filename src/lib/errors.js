const userNotFoundError = {
  status: 400,
  message: 'User not found',
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

const paramError = {
  status: 400,
  message: 'Invalid parameters',
  name: 'paramError',
};

const accessDenied = {
  status: 403,
  message: 'Access denied',
  name: 'accessDenied',
};

const createParamError = ({ message }) => ({
  ...paramError,
  message,
});

const emailVerifiedError = {
  status: 400,
  message: 'User email is verified',
  name: 'emailVerifiedError',
};

const invalidEmailVerificationCodeError = {
  status: 400,
  message: 'Wrong code',
  name: 'invalidEmailVerificationCodeError',
};

const emailNotVerifiedError = {
  status: 400,
  message: 'Email Not Verified',
  name: 'emailNotVerifiedError',
};

const sessionExipred = {
  status: 403,
  message: 'Session Exipred',
  name: 'sessionExipred',
};

module.exports = {
  userNotFoundError,
  invalidPasswordError,
  emailTakenError,
  paramError,
  createParamError,
  accessDenied,
  emailVerifiedError,
  invalidEmailVerificationCodeError,
  emailNotVerifiedError,
  sessionExipred,
};
