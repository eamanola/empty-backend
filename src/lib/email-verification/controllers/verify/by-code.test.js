const { createUser, deleteUsers, findUser } = require('../../../jest/test-helpers');

const { request } = require('..');

const emailVerificationErrors = require('../../errors');

const verifyByCode = require('./by-code');

jest.mock('../../utils/send-email-verification-mail');

describe('email verification', () => {
  afterEach(deleteUsers);

  describe('verify by code', () => {
    it('should set email verified', async () => {
      const user = await createUser();
      await request(user, { });

      const requestingUser = await findUser({ id: user.id });
      expect(requestingUser.emailVerified).toBe(false);
      const { emailVerificationCode: code } = requestingUser;

      await verifyByCode(requestingUser, code);

      const verifiedUser = await findUser({ id: user.id });
      expect(verifiedUser.emailVerified).toBe(true);
    });

    it('should throw invalidEmailVerificationCodeError, on mismatch', async () => {
      const { invalidEmailVerificationCodeError } = emailVerificationErrors;
      const user = await createUser();
      await request(user, { });

      const fakeCode = 1000;
      const requestingUser = await findUser({ id: user.id });
      expect(fakeCode).not.toBe(requestingUser.emailVerificationCode);

      try {
        await verifyByCode(requestingUser, fakeCode);
        expect('unreachable').toBe(true);
      } catch ({ name }) {
        expect(name).toBe(invalidEmailVerificationCodeError.name);
      }
    });
  });
});
