const { deleteAll } = require('automata-db');

const {
  createUser,
  deleteUsers,
  setEmailStatus,
} = require('../../jest/test-helpers');

// const userErrors = require('../../users/errors');
const emailVerificationErrors = require('../errors');

const { decode: decodeEmailVerificationToken } = require('../../utils/token');
const { SECRET } = require('../../../config');

const sendEmailVerificationMail = require('../utils/send-email-verification-mail');

const { findOne } = require('../model');
const { name: tableName } = require('../model/table');

const request = require('./request');

jest.mock('../utils/send-email-verification-mail');

describe('email verification', () => {
  afterEach(async () => {
    sendEmailVerificationMail.mockClear();

    await deleteUsers();
    await deleteAll(tableName);
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
      const user = await createUser();
      await setEmailStatus({ email: user.email, verified: true });

      try {
        await request(user.email, { });
        expect('unreachable').toBe(true);
      } catch ({ name }) {
        expect(name).toBe(emailVerifiedError.name);
      }
    });

    it('should update code', async () => {
      const user = await createUser();
      const { code: oldCode } = await findOne(user.email);
      expect(oldCode).toEqual(expect.any(Number));

      await request(user.email, { });

      const { code: updatedCode } = await findOne(user.email);
      expect(updatedCode).toEqual(expect.any(Number));

      expect(oldCode).not.toBe(updatedCode);
    });

    it('should send verification mail', async () => {
      const user = await createUser();

      await request(user.email, { });

      expect(sendEmailVerificationMail)
        .toHaveBeenCalledWith(expect.objectContaining({ to: user.email }));
    });

    describe('byCode', () => {
      it('should include byCode and code, if byCode provided', async () => {
        const user = await createUser();
        const byCode = 'http://example.com/form-to-enter-your-code';

        await request(user.email, { byCode });

        const { code: updatedCode } = await findOne(user.email);

        const { byCode: sentByCode, code } = sendEmailVerificationMail.mock.calls[0][0];
        expect(sentByCode).toBe(byCode);
        expect(code).toBe(updatedCode);
      });

      it('byCode and code should be falsy, if byCode not provided', async () => {
        const user = await createUser();
        const byCode = null;

        await request(user.email, { byCode });

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

        await request(user.email, { byLink });

        const { code: updatedCode } = await findOne(user.email);

        const { token } = sendEmailVerificationMail.mock.calls[0][0];
        expect(token).toBeTruthy();

        const decodedToken = decodeEmailVerificationToken(token, SECRET);
        expect(decodedToken.email).toBeTruthy();
        expect(decodedToken.email).toBe(user.email);

        expect(decodedToken.byLink).toBeTruthy();
        expect(decodedToken.byLink).toEqual(byLink);

        expect(decodedToken.code).toBeTruthy();
        expect(decodedToken.code).toBe(updatedCode);
      });

      it('token should be falsy, if byLink not provided', async () => {
        const user = await createUser();

        await request(user.email, { byLink: null });

        const { token } = sendEmailVerificationMail.mock.calls[0][0];
        expect(token).toBe(null);
      });
    });
  });
});
