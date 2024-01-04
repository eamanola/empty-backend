const { invalidEmailVerificationCodeError } = require('../../../../errors');
const { createUser } = require('../../../../jest/test-helpers');
const { findOne } = require('../../../../models/users');
const request = require('../request');
const verifyByCode = require('./by-code');

jest.mock('../../../../utils/send-email-verification-mail');

describe('email verification', () => {
  describe('verify by code', () => {
    it('should set email verified', async () => {
      const user = await createUser();
      await request(user, { });

      const requestingUser = await findOne({ id: user.id });
      expect(requestingUser.emailVerified).toBe(false);
      const { emailVerificationCode: code } = requestingUser;

      await verifyByCode(requestingUser, code);

      const verifiedUser = await findOne({ id: user.id });
      expect(verifiedUser.emailVerified).toBe(true);
    });

    it('should throw invalidEmailVerificationCodeError, on mismatch', async () => {
      const user = await createUser();
      await request(user, { });

      const code = 1000;
      const requestingUser = await findOne({ id: user.id });
      expect(code).not.toBe(requestingUser.emailVerificationCode);

      try {
        await verifyByCode(requestingUser, code);
        expect('unreachable').toBe(true);
      } catch ({ name }) {
        expect(name).toBe(invalidEmailVerificationCodeError.name);
      }
    });
  });
});
