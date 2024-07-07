const { utils } = require('automata-utils');

const { createUser, deleteAll, setVerified } = require('../jest/test-helpers');

// const userErrors = require('../../users/errors');
const emailVerificationErrors = require('../errors');

const { EMAIL_VERIFICATION_SECRET } = require('../config');

const sendEmailVerificationMail = require('../utils/send-email-verification-mail');

const { findOne } = require('../model');

const request = require('./request');

const { token: emailVerificationToken } = utils;
const { decode } = emailVerificationToken;

jest.mock('../utils/send-email-verification-mail');

describe('email verification', () => {
  afterEach(async () => {
    sendEmailVerificationMail.mockClear();

    await deleteAll();
  });

  describe('request', () => {
    // /* not email-verifications responsibility anymore      */
    // /* downside, might end up with a lot of fake emails :/ */
    // it('should throw user not found', async () => {
    //   const { userNotFoundError } = userErrors;
    //   try {
    //     const email = 'fake';
    //     await request(email, { });
    //     expect('unreachable').toBe(true);
    //   } catch ({ name }) {
    //     expect(name).toBe(userNotFoundError.name);
    //   }
    // });

    it('should throw already verified error', async () => {
      const { emailVerifiedError } = emailVerificationErrors;
      const { email } = await createUser();
      await setVerified(email);

      try {
        await request(email, { });
        expect('unreachable').toBe(true);
      } catch ({ name }) {
        expect(name).toBe(emailVerifiedError.name);
      }
    });

    it('should update code', async () => {
      const { email } = await createUser();
      const { code: oldCode } = await findOne(email);
      expect(oldCode).toEqual(expect.any(Number));

      await request(email, { });

      const { code: updatedCode } = await findOne(email);
      expect(updatedCode).toEqual(expect.any(Number));

      expect(oldCode).not.toBe(updatedCode);
    });

    it('should send verification mail', async () => {
      const { email } = await createUser();

      await request(email, { });

      expect(sendEmailVerificationMail)
        .toHaveBeenCalledWith(expect.objectContaining({ to: email }));
    });

    describe('byCode', () => {
      it('should include byCode and code, if byCode provided', async () => {
        const { email } = await createUser();
        const byCode = 'http://example.com/form-to-enter-your-code';

        await request(email, { byCode });

        const { code: updatedCode } = await findOne(email);

        const { byCode: sentByCode, code } = sendEmailVerificationMail.mock.calls[0][0];
        expect(sentByCode).toBe(byCode);
        expect(code).toBe(updatedCode);
      });

      it('byCode and code should be falsy, if byCode not provided', async () => {
        const { email } = await createUser();
        const byCode = null;

        await request(email, { byCode });

        const { byCode: sentByCode, code } = sendEmailVerificationMail.mock.calls[0][0];
        expect(sentByCode).toBe(null);
        expect(code).toBe(null);
      });
    });

    describe('byLink', () => {
      it('should include token, if byLink is provided', async () => {
        const { email } = await createUser();
        const onSuccess = 'http://example.com/your-email-has-been-verified';
        const onFail = 'http://example.com/something-went-wrong';
        const byLink = { onFail, onSuccess };

        await request(email, { byLink });

        const { code: updatedCode } = await findOne(email);

        const { token } = sendEmailVerificationMail.mock.calls[0][0];
        expect(token).toBeTruthy();

        const decodedToken = decode(token, EMAIL_VERIFICATION_SECRET);
        expect(decodedToken.email).toBeTruthy();
        expect(decodedToken.email).toBe(email);

        expect(decodedToken.byLink).toBeTruthy();
        expect(decodedToken.byLink).toEqual(byLink);

        expect(decodedToken.code).toBeTruthy();
        expect(decodedToken.code).toBe(updatedCode);
      });

      it('token should be falsy, if byLink not provided', async () => {
        const { email } = await createUser();

        await request(email, { byLink: null });

        const { token } = sendEmailVerificationMail.mock.calls[0][0];
        expect(token).toBe(null);
      });
    });
  });
});
