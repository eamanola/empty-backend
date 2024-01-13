const supertest = require('supertest');

const { createUser, findUser, deleteUsers } = require('../../../jest/test-helpers');

const { request: requestVerification } = require('../../../controllers/users/email-verification');

const sendEmailVerificationMail = require('../../../utils/send-email-verification-mail');

const app = require('../../../app');
const { setUnverified } = require('../../../controllers/users/email-verification/set-status');

jest.mock('../../../utils/send-email-verification-mail');

const api = supertest(app);

describe('by-link', () => {
  beforeEach(async () => {
    sendEmailVerificationMail.mockClear();

    await deleteUsers();
  });

  it('should verify email', async () => {
    const user = await createUser();
    expect(user.emailVerified).toBe(false);

    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onSuccess, onFail };

    await requestVerification(user, { byLink });
    const { token } = sendEmailVerificationMail.mock.calls[0][0];

    await api.get(`/email-verification/by-link?token=${token}`);

    const updatedUser = await findUser({ id: user.id });
    expect(updatedUser.emailVerified).toBe(true);
  });

  it('should redirect to onSuccess', async () => {
    const user = await createUser();

    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onSuccess, onFail };

    await requestVerification(user, { byLink });
    const { token } = sendEmailVerificationMail.mock.calls[0][0];

    await api.get(`/email-verification/by-link?token=${token}`)
      .expect('Location', onSuccess);
  });

  it('should redirect to onFail', async () => {
    const user = await createUser();

    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onSuccess, onFail };

    await requestVerification(user, { byLink });
    const { token } = sendEmailVerificationMail.mock.calls[0][0];

    // refresh code
    await setUnverified(user.id);

    await api.get(`/email-verification/by-link?token=${token}`)
      .expect('Location', onFail);
  });
});
