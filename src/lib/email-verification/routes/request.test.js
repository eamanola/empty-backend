const supertest = require('supertest');

const { createUser, deleteUsers } = require('../../jest/test-helpers');

const sendEmailVerificationMail = require('../utils/send-email-verification-mail');

const { app } = require('../..');
const { findOne } = require('../model');

jest.mock('../utils/send-email-verification-mail');

const api = supertest(app);

describe('request verification', () => {
  afterAll(deleteUsers);

  it('should send verification mail', async () => {
    const user = await createUser();

    const byCode = 'http://example.com/form-to-enter-your-code';
    const onSuccess = 'http://example.com/your-email-has-been-verified';
    const onFail = 'http://example.com/something-went-wrong';
    const byLink = { onFail, onSuccess };

    await api.post('/email-verification')
      .send({ byCode, byLink, email: user.email });

    const { code } = await findOne(user.email);

    expect(sendEmailVerificationMail).toHaveBeenCalledWith(expect.objectContaining({
      byCode,
      code,
      to: user.email,
      token: expect.any(String),
    }));
  });
});
