const { emailVerifiedError, invalidEmailVerificationCodeError } = require('../../errors');
const { createUser } = require('../../jest/test-helpers');
const { findOne } = require('../../models/users');
const sendEmailVerificationMail = require('../../utils/send-email-verification-mail');
const { decode: decodeToken } = require('../../token');
const { getCode, request, verifyByCode } = require('./email-verification');

jest.mock('../../utils/send-email-verification-mail');

describe('email verification', () => {
  beforeEach(() => {
    sendEmailVerificationMail.mockClear();
  });

  describe('getCode', () => {
    it('should be an integer between 100000 and 1000000', () => {
      const code = getCode();
      expect(code > 100000).toBe(true);
      expect(code < 1000000).toBe(true);
      expect(Math.floor(code)).toBe(code);
    });
  });

  describe('request', () => {
    it('should throw already verified error', async () => {
      const user = await createUser();
      try {
        await request({ ...user, emailVerified: true }, {});
        expect('unreachable').toBe(true);
      } catch ({ name }) {
        expect(name).toBe(emailVerifiedError.name);
      }
    });

    it('should update emailVerificationCode', async () => {
      const user = await createUser();

      await request(user, { });

      const updatedUser = await findOne({ id: user.id });
      expect(user.emailVerificationCode).not.toBe(updatedUser.emailVerificationCode);
      expect(updatedUser.emailVerificationCode).toBeTruthy();
    });

    it('should send verification mail', async () => {
      const user = await createUser();

      await request(user, { });

      expect(sendEmailVerificationMail).toHaveBeenCalledWith(expect.objectContaining({
        to: user.email,
      }));
    });

    describe('byCode', () => {
      it('should include code and byLink, if byCode provided', async () => {
        const user = await createUser();
        const byCode = 'http://example.com/form-to-enter-your-code';

        await request(user, { byCode });

        const updatedUser = await findOne({ id: user.id });

        expect(sendEmailVerificationMail).toHaveBeenCalledWith(expect.objectContaining({
          code: updatedUser.emailVerificationCode,
          byCode,
        }));
      });

      it('code and byLink should be falsy, if byCode not provided', async () => {
        const user = await createUser();

        await request(user, { byCode: null });

        const { code, byCode } = sendEmailVerificationMail.mock.calls[0][0];
        expect(code).toBe(null);
        expect(byCode).toBe(null);
      });
    });

    describe('byLink', () => {
      it('should include token, if byLink provided', async () => {
        const user = await createUser();
        const onSuccess = 'http://example.com/your-email-has-been-verified';
        const onFail = 'http://example.com/something-went-wrong';
        const byLink = {
          onSuccess,
          onFail,
        };

        await request(user, { byLink });

        const updatedUser = await findOne({ id: user.id });

        const { token } = sendEmailVerificationMail.mock.calls[0][0];
        expect(token).toBeTruthy();

        const decodedToken = decodeToken(token);
        expect(decodedToken.userId).toBeTruthy();
        expect(decodedToken.userId).toBe(user.id);

        expect(decodedToken.byLink).toBeTruthy();
        expect(decodedToken.byLink).toEqual(byLink);

        expect(decodedToken.code).toBeTruthy();
        expect(decodedToken.code).toBe(updatedUser.emailVerificationCode);
      });

      it('token should be falsy, if byLink not provided', async () => {
        const user = await createUser();

        await request(user, { byLink: null });

        const { token } = sendEmailVerificationMail.mock.calls[0][0];
        expect(token).toBe(null);
      });
    });
  });

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
