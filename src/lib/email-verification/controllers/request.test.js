const {
  createUser,
  deleteUsers,
  findUser,
  setEmailStatus,
} = require('../../jest/test-helpers');

const userErrors = require('../../users/errors');
const emailVerificationErrors = require('../errors');

const { decode: decodeEmailVerificationToken } = require('../../utils/token');
const { SECRET } = require('../../../config');

const sendEmailVerificationMail = require('../utils/send-email-verification-mail');

const request = require('./request');

jest.mock('../utils/send-email-verification-mail');

describe('email verification', () => {
  afterEach(async () => {
    sendEmailVerificationMail.mockClear();

    await deleteUsers();
  });

  describe('request', () => {
    it('should throw user not found', async () => {
      const { userNotFoundError } = userErrors;
      try {
        await request({ email: 'fake' }, {});
        expect('unreachable').toBe(true);
      } catch ({ name }) {
        expect(name).toBe(userNotFoundError.name);
      }
    });

    it('should throw already verified error', async () => {
      const { emailVerifiedError } = emailVerificationErrors;
      const user = await createUser();
      await setEmailStatus({ userId: user.id, verified: true });

      try {
        await request(user, {});
        expect('unreachable').toBe(true);
      } catch ({ name }) {
        expect(name).toBe(emailVerifiedError.name);
      }
    });

    it('should update emailVerificationCode', async () => {
      const user = await createUser();
      expect(user.emailVerificationCode).toBeTruthy();

      await request(user, { });

      const updatedUser = await findUser({ id: user.id });
      expect(updatedUser.emailVerificationCode).toBeTruthy();

      expect(user.emailVerificationCode).not.toBe(updatedUser.emailVerificationCode);
    });

    it('should send verification mail', async () => {
      const user = await createUser();

      await request(user, { });

      expect(sendEmailVerificationMail)
        .toHaveBeenCalledWith(expect.objectContaining({ to: user.email }));
    });

    describe('byCode', () => {
      it('should include byCode and code, if byCode provided', async () => {
        const user = await createUser();
        const byCode = 'http://example.com/form-to-enter-your-code';

        await request(user, { byCode });

        const updatedUser = await findUser({ id: user.id });

        const { byCode: sentByCode, code } = sendEmailVerificationMail.mock.calls[0][0];
        expect(sentByCode).toBe(byCode);
        expect(code).toBe(updatedUser.emailVerificationCode);
      });

      it('byCode and code should be falsy, if byCode not provided', async () => {
        const user = await createUser();
        const byCode = null;

        await request(user, { byCode });

        const { byCode: sentByCode, code } = sendEmailVerificationMail.mock.calls[0][0];
        expect(sentByCode).toBe(null);
        expect(code).toBe(null);
      });
    });

    describe('byLink', () => {
      it('should include token, if byLink is provided', async () => {
        const user = await createUser();
        const onSuccess = 'http://example.com/your-email-has-been-verified';
        const onFail = 'http://example.com/something-went-wrong';
        const byLink = { onFail, onSuccess };

        await request(user, { byLink });

        const updatedUser = await findUser({ id: user.id });

        const { token } = sendEmailVerificationMail.mock.calls[0][0];
        expect(token).toBeTruthy();

        const decodedToken = decodeEmailVerificationToken(token, SECRET);
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
});
