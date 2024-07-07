const {
  createUser,
  deleteUsers,
  isEmailVerified,
} = require('../../../jest/test-helpers');

const { request } = require('..');

const emailVerificationErrors = require('../../errors');

const verifyByCode = require('./by-code');
const { findOne } = require('../../model');

jest.mock('../../utils/send-email-verification-mail');

describe('email verification', () => {
  afterEach(deleteUsers);

  describe('verify by code', () => {
    it('should set email verified', async () => {
      const user = await createUser();
      await request(user.email, { });

      const { code } = await findOne(user.email);
      expect(code).toEqual(expect.any(Number));

      await verifyByCode(user.email, code);

      expect(await isEmailVerified(user.email)).toBe(true);
    });

    it('should throw invalidEmailVerificationCodeError, on mismatch', async () => {
      const { invalidEmailVerificationCodeError } = emailVerificationErrors;
      const user = await createUser();
      await request(user.email, { });

      const fakeCode = 1000;
      const { code } = await findOne(user.email);
      expect(code).toEqual(expect.any(Number));
      expect(fakeCode).not.toBe(code);

      try {
        await verifyByCode(user.email, fakeCode);
        expect('unreachable').toBe(true);
      } catch ({ name }) {
        expect(name).toBe(invalidEmailVerificationCodeError.name);
      }
    });
  });
});
