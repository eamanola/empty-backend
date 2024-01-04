const supertest = require('supertest');

const { createUser } = require('../../jest/test-helpers');

const sendEmailVerificationMail = require('../../utils/send-email-verification-mail');

const app = require('../../app');

jest.mock('../../utils/send-email-verification-mail');

const api = supertest(app);

describe('request verification', () => {
  it('should send verification mail', async () => {
    const user = await createUser();

    const byCode = 'http://example.com/form-to-enter-your-code';
    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onSuccess, onFail };

    await api.post('/email-verification/request')
      .send({ email: user.email, byCode, byLink });

    expect(sendEmailVerificationMail).toHaveBeenCalledWith(expect.objectContaining({
      to: user.email,
      byCode,
      code: expect.any(Number),
      token: expect.any(String),
    }));
  });
});
