const { createUser } = require('../../../../jest/test-helpers');
const { findOne, updateOne } = require('../../../../models/users');
const sendEmailVerificationMail = require('../../../../utils/send-email-verification-mail');
const request = require('../request');

const verifyByLink = require('./by-link');

jest.mock('../../../../utils/send-email-verification-mail');

describe('email verification', () => {
  beforeEach(() => {
    sendEmailVerificationMail.mockClear();
  });

  describe('verify by link', () => {
    it('should set email verified, and redirect to onSuccess', async () => {
      const user = await createUser();
      const onSuccess = 'http://example.com/your-email-has-been-verified';
      const onFail = 'http://example.com/something-went-wrong';
      const byLink = {
        onSuccess,
        onFail,
      };
      await request(user, { byLink });
      const { token } = sendEmailVerificationMail.mock.calls[0][0];

      const redirectUrl = await verifyByLink(token);
      expect(redirectUrl).toBe(byLink.onSuccess);

      const verifiedUser = await findOne({ id: user.id });
      expect(verifiedUser.emailVerified).toBe(true);
    });

    it('should redirect to onFail, if fail', async () => {
      const user = await createUser();
      const onSuccess = 'http://example.com/your-email-has-been-verified';
      const onFail = 'http://example.com/something-went-wrong';
      const byLink = {
        onSuccess,
        onFail,
      };
      await request(user, { byLink });
      const { token } = sendEmailVerificationMail.mock.calls[0][0];

      await updateOne({ id: user.id }, { emailVerificationCode: 1000 });

      const redirectUrl = await verifyByLink(token);
      expect(redirectUrl).toBe(byLink.onFail);

      const unVerifiedUser = await findOne({ id: user.id });
      expect(unVerifiedUser.emailVerified).toBe(false);
    });
  });
});
