const { createUser, deleteAll, isVerified } = require('../../jest/test-helpers');

const { request } = require('..');

const emailVerificationErrors = require('../../errors');

const verifyByCode = require('./by-code');
const { findOne } = require('../../model');

jest.mock('../../utils/send-email-verification-mail');

describe('email verification', () => {
  afterEach(deleteAll);

  describe('verify by code', () => {
    it('should set email verified', async () => {
      const { email } = await createUser();
      await request(email, { });

      const { code } = await findOne(email);
      expect(code).toEqual(expect.any(Number));

      await verifyByCode(email, code);

      expect(await isVerified(email)).toBe(true);
    });

    it('should throw invalidEmailVerificationCodeError, on mismatch', async () => {
      const { invalidEmailVerificationCodeError } = emailVerificationErrors;
      const { email } = await createUser();
      await request(email, { });

      const fakeCode = 1000;
      const { code } = await findOne(email);
      expect(code).toEqual(expect.any(Number));
      expect(fakeCode).not.toBe(code);

      try {
        await verifyByCode(email, fakeCode);
        expect('unreachable').toBe(true);
      } catch ({ name }) {
        expect(name).toBe(invalidEmailVerificationCodeError.name);
      }
    });
  });
});
