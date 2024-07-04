const supertest = require('supertest');

const {
  createUser,
  findUser,
  deleteUsers,
  setEmailStatus,
} = require('../../../jest/test-helpers');

const { request } = require('../../controllers');

const sendEmailVerificationMail = require('../../utils/send-email-verification-mail');

const app = require('../../../../app');

jest.mock('../../utils/send-email-verification-mail');

const api = supertest(app);

describe('by-link', () => {
  afterEach(async () => {
    sendEmailVerificationMail.mockClear();

    await deleteUsers();
  });

  it('should verify email', async () => {
    const user = await createUser();
    expect(user.emailVerified).toBe(false);

    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onFail, onSuccess };

    await request(user, { byLink });
    const { token } = sendEmailVerificationMail.mock.calls[0][0];

    await api.get(`/email-verification?token=${token}`);

    const updatedUser = await findUser({ id: user.id });
    expect(updatedUser.emailVerified).toBe(true);
  });

  it('should redirect to onSuccess', async () => {
    const user = await createUser();

    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onFail, onSuccess };

    await request(user, { byLink });
    const { token } = sendEmailVerificationMail.mock.calls[0][0];

    await api.get(`/email-verification?token=${token}`)
      .expect('Location', onSuccess);
  });

  it('should redirect to onFail', async () => {
    const user = await createUser();

    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onFail, onSuccess };

    await request(user, { byLink });
    const { token } = sendEmailVerificationMail.mock.calls[0][0];

    // refresh code
    await setEmailStatus({ userId: user.id, verified: false });

    await api.get(`/email-verification?token=${token}`)
      .expect('Location', onFail);
  });
});
