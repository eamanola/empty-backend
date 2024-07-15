const supertest = require('supertest');

const { router: restRouter } = require('automata-rest');

const { dropTable } = require('automata-db');

const app = require('./app');

describe('automata-rest', () => {
  it('should save, edit & retrieve resources', async () => {
    const table = { columns: [{ name: 'foo', required: true, type: 'string' }], name: 'test' };
    const router = restRouter(null, { table, userRequired: false });
    app.use('/test', router);
    const api = supertest(app);

    const post = await api.post('/test').send({ foo: 'bar' });
    expect(post.status).toBe(201);

    const { result: created } = post.body;
    const { id } = created;
    expect(created).toEqual(expect.objectContaining({ foo: 'bar' }));

    const get = await api.get(`/test/${id}`);
    expect(get.status).toBe(200);
    expect(get.body.result).toEqual(created);

    const put = await api.put(`/test/${id}`).send({ ...created, foo: 'baz' });
    expect(put.status).toBe(200);
    expect(put.body.result).toEqual(expect.objectContaining({ foo: 'baz', id }));

    const get2 = await api.get(`/test/${id}`);
    expect(get2.status).toBe(200);
    expect(get2.body.result).toEqual(expect.objectContaining({ foo: 'baz', id }));

    await dropTable(table.name);
  });
});
