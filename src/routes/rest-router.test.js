const { object, string } = require('yup');

const supertest = require('supertest');

const app = require('../app');

const { APIgetToken } = require('../jest/test-helpers');

const { fromToken: userFromToken } = require('../controllers/users');

const { paramError, accessDenied } = require('../errors');

const { deleteMany } = require('../db');

const validator = object({ foo: string().required() }).noUnknown().strict();

const table = 'test';

const restModel = require('../models/rest-model');
const restController = require('../controllers/rest-controller');
const restRouter = require('./rest-router');

const model = restModel(table, validator);
const router = restRouter(restController(model));

const baseUrl = '/test';

app.use(baseUrl, router);

const api = supertest(app);

const getById = async (id, token) => {
  const { result } = (
    await api
      .get(`${baseUrl}/${id}`)
      .set({ Authorization: `bearer ${token}` })
  ).body;

  return result;
};

const create = async ({
  token,
  resource = { foo: 'bar' },
}) => {
  const { result } = (
    await api
      .post(baseUrl)
      .set({ Authorization: `bearer ${token}` })
      .send(resource)
  ).body;

  return result;
};

describe('rest router', () => {
  beforeEach(() => deleteMany(model.table, {}));

  it('should throw accessDenied, if user missing', async () => {
    const response = await api.get(baseUrl);

    expect(response.status).toBe(accessDenied.status);
  });

  describe('POST /', () => {
    it('should create one', async () => {
      const token = await APIgetToken({ api });
      const resource = { foo: 'bar' };

      const response = await api
        .post(baseUrl)
        .set({ Authorization: `bearer ${token}` })
        .send(resource);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('CREATED');

      const { result } = response.body;
      expect(result).toEqual(expect.objectContaining(resource));
      expect(await getById(result.id, token)).toEqual(result);
    });

    it('should throw paramError, on invalid params', async () => {
      const token = await APIgetToken({ api });
      const invalid = {};

      const response = await api
        .post(baseUrl)
        .set({ Authorization: `bearer ${token}` })
        .send(invalid);

      expect(response.status).toBe(paramError.status);
      expect(response.body.result).toBeFalsy();
    });
  });

  describe('GET /:id', () => {
    it('should return a result by id', async () => {
      const token = await APIgetToken({ api });
      const resource = await create({ api, token });

      const response = await api
        .get(`${baseUrl}/${resource.id}`)
        .set({ Authorization: `bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');
      expect(response.body.result).toEqual(resource);
    });
  });

  describe('GET /', () => {
    it('should return all user resources', async () => {
      const token = await APIgetToken({ api });
      const token2 = await APIgetToken({ api, email: 'foo2@other.com' });

      await create({ api, token });
      await create({ api, token });

      await create({ api, token: token2 });

      const { results } = (
        await api
          .get(baseUrl)
          .set({ Authorization: `bearer ${token}` })
      ).body;

      expect(results.length).toBe(2);

      const user = await userFromToken(token);

      expect(results.every(({ owner }) => owner === user.id)).toBe(true);
    });
  });

  describe('PUT /:id', () => {
    it('should update one', async () => {
      const token = await APIgetToken({ api });
      const inserted = await create({ api, token });

      const changed = { ...inserted, foo: 'foo1' };
      expect(changed.foo).not.toBe(inserted.foo);

      const response = await api
        .put(`${baseUrl}/${inserted.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(changed);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');

      const { modified, ...data } = changed;
      expect(response.body.result).toEqual(expect.objectContaining(data));

      const updated = await getById(inserted.id, token);
      expect(updated.foo).toBe(changed.foo);
    });

    it('should throw paramError, on invalid params', async () => {
      const token = await APIgetToken({ api });
      const inserted = await create({ api, token });

      const invalid = { ...inserted, foo: '' };
      expect(invalid.foo).not.toBe(inserted.foo);

      const response = await api
        .put(`${baseUrl}/${inserted.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(invalid);

      expect(response.status).toBe(paramError.status);

      const updated = await getById(inserted.id, token);
      expect(updated).toEqual(inserted);
    });

    it('should not update owner, or modified', async () => {
      const token = await APIgetToken({ api });
      const inserted = await create({ api, token });

      const modified = { ...inserted, owner: 'foo', modified: 'bar' };
      expect(modified.owner).not.toBe(inserted.owner);
      expect(modified.modified).not.toBe(inserted.modified);

      await api
        .put(`${baseUrl}/${inserted.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modified);

      const updated = await getById(inserted.id, token);
      expect(updated.owner).toBe(inserted.owner);
      expect(updated.modified).not.toBe(modified.modified);
    });

    it('should not update id', async () => {
      const token = await APIgetToken({ api });
      const inserted = await create({ api, token });

      const modified = {
        ...inserted,
        id: `ABCDE${inserted.id.substring(5)}`,
      };
      expect(modified.id).not.toBe(inserted.id);

      await api
        .put(`${baseUrl}/${inserted.id}`)
        .set({ Authorization: `bearer ${token}` })
        .send(modified);

      const updated = await getById(modified.id, token);
      expect(updated).toBeFalsy();

      const original = await getById(inserted.id, token);
      expect(original).toEqual(inserted);
    });
  });

  describe('DELETE /:id', () => {
    it('should remove by id', async () => {
      const token = await APIgetToken({ api });
      const resource = await create({ api, token });

      const response = await api
        .delete(`${baseUrl}/${resource.id}`)
        .set({ Authorization: `bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');

      const deleted = await getById(resource.id, token);
      expect(deleted).toBeFalsy();
    });
  });
});
