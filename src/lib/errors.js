const userNotFoundError = {
  message: 'User not found',
  name: 'userNotFoundError',
  status: 400,
};

const invalidPasswordError = {
  message: 'Login failed',
  name: 'invalidPasswordError',
  status: 400,
};

const emailTakenError = {
  message: 'Email already in use.',
  name: 'emailTakenError',
  status: 400,
};

const paramError = {
  message: 'Invalid parameters',
  name: 'paramError',
  status: 400,
};

const accessDenied = {
  message: 'Access denied',
  name: 'accessDenied',
  status: 403,
};

const createParamError = ({ message }) => ({
  ...paramError,
  message,
});

const emailVerifiedError = {
  message: 'User email is verified',
  name: 'emailVerifiedError',
  status: 400,
};

const invalidEmailVerificationCodeError = {
  message: 'Wrong code',
  name: 'invalidEmailVerificationCodeError',
  status: 400,
};

const emailNotVerifiedError = {
  message: 'Email Not Verified',
  name: 'emailNotVerifiedError',
  status: 400,
};

const sessionExipred = {
  message: 'Session Exipred',
  name: 'sessionExipred',
  status: 403,
};

module.exports = {
  accessDenied,
  createParamError,
  emailNotVerifiedError,
  emailTakenError,
  emailVerifiedError,
  invalidEmailVerificationCodeError,
  invalidPasswordError,
  paramError,
  sessionExipred,
  userNotFoundError,
};
