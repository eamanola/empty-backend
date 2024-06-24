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

module.exports = {
  emailVerifiedError,
  invalidEmailVerificationCodeError,
};
