const { errors } = require('automata-utils');
const { deleteUsers, getToken } = require('../../jest/test-helpers');

const authorization = require('./authorization');

describe('authorization', () => {
  afterEach(deleteUsers);

  it('should add user to request', async () => {
    const email = 'foo@example.bar';
    const password = 'foo';

    const { token } = await getToken({ email, password });

    const req = { get: (/* authorization */) => `bearer ${token}` };
    const res = {};
    const next = () => {};

    expect(req.user).toBeFalsy();

    await authorization(req, res, next);

    expect(req.user).toEqual(expect.objectContaining({ email }));
  });

  it('should not add user, if token is missing', async () => {
    let error;
    const req = { get: (/* authorization */) => '' };
    const res = {};
    const next = (e) => { error = e; };

    expect(req.user).toBeFalsy();
    expect(req.get('authorization')).toBeFalsy();

    await authorization(req, res, next);

    expect(error).toBeFalsy();
    expect(req.user).toBeFalsy();
  });

  it('should not add user, if token is invalid bearer', async () => {
    const { accessDenied } = errors;

    let error;
    const req = { get: (/* authorization */) => 'bearer foo' };
    const res = {};
    const next = (e) => { error = e; };

    expect(req.user).toBeFalsy();
    expect(req.get('authorization')).toBeTruthy();

    await authorization(req, res, next);

    expect(error).toEqual(accessDenied);
    expect(req.user).toBeFalsy();
  });
});
