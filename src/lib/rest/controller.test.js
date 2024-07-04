const { createUser, deleteUsers } = require('../jest/test-helpers');

const { count, deleteAll, dropTable } = require('../db');

const restController = require('./controller');
const restModel = require('./model');

const columns = [{ name: 'foo', required: true, type: 'string' }];

const table = { columns, name: 'test' };

const {
  create,
  byId,
  byOwner,
  update,
  remove,
} = restController(null, { table });

const createResource = async (user) => {
  const resource = { foo: 'bar' };
  return create(user, resource);
};

describe('rest controller', () => {
  afterAll(async () => {
    await dropTable(table.name);
    await deleteUsers();
  });

  afterEach(async () => {
    await deleteAll(table.name);
    await deleteUsers();
  });

  describe('create', () => {
    it('should create one', async () => {
      const user = await createUser();
      const resource = { foo: 'bar' };

      expect(await count(table.name)).toBe(0);

      await create(user, resource);

      expect(await count(table.name)).toBe(1);
    });

    it('should override owner', async () => {
      const user = await createUser();
      const resource = { foo: 'bar' };

      const fakeOwner = '1234';

      const created = await create(user, { ...resource, owner: fakeOwner });

      expect((await byOwner(user))[0]).toEqual(created);
      expect((await byOwner({ id: fakeOwner }))).toEqual([]);
    });

    it('should return created', async () => {
      const user = await createUser();
      const resource = { foo: 'bar' };

      const created = await create(user, resource);
      expect(created).toEqual(await byId(user, { id: created.id }));
    });
  });

  describe('byId', () => {
    it('should find by id', async () => {
      const user = await createUser();
      const resource = await createResource(user);
      const { id } = resource;

      const resourceById = await byId(user, { id });

      expect(resourceById).toEqual(resource);
    });

    it('should not return resources of other users', async () => {
      const user = await createUser();
      const user2 = await createUser({ email: 'bar@example.com' });

      const { id } = await createResource(user);

      expect(await byId(user, { id })).toBeTruthy();
      expect(await byId(user2, { id })).toBeFalsy();
    });

    it('should not return owner', async () => {
      const user = await createUser();
      const resource = await createResource(user);

      const result = await byId(user, { id: resource.id });

      expect(result.owner).toBeFalsy();
    });
  });

  describe('byOwner', () => {
    it('should find all user resources', async () => {
      const user = await createUser();

      const TIMES = 3;
      const promises = [];
      for (let i = 0; i < TIMES; i += 1) {
        promises.push(createResource(user));
      }
      await Promise.all(promises);

      const results = await byOwner(user);
      expect(results.length).toBe(TIMES);
    });

    it('should not return resources of other users', async () => {
      const user = await createUser();
      await createResource(user);

      const user2 = await createUser({ email: 'bar@example.com' });
      await createResource(user2);

      expect(await count(table.name)).toBe(2);

      expect((await byOwner(user)).length).toBe(1);
      expect((await byOwner(user2)).length).toBe(1);
    });

    it('should not return owner', async () => {
      const user = await createUser();
      const resource = await createResource(user);

      const results = await byOwner(user);
      expect(results[0]).toEqual(resource);
      expect(results[0].owner).toBeFalsy();
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      const user = await createUser();
      const resource = await createResource(user);
      const { id } = resource;

      const foo = 'text2';
      expect(foo).not.toBe(resource.foo);

      await update(user, { ...resource, foo });

      const updated = await byId(user, { id });

      expect(updated).toEqual(expect.objectContaining({ foo }));
    });

    it('should not update owner', async () => {
      const user = await createUser();
      const resource = await createResource(user);

      const fakeOwner = 'foo';
      expect(fakeOwner).not.toBe(resource.owner);

      await update(user, { ...resource, owner: fakeOwner });

      expect((await byOwner(user)).length).toBe(1);
      expect((await byOwner({ id: fakeOwner })).length).toBe(0);
    });

    it('should not update modified', async () => {
      const user = await createUser();
      const resource = await createResource(user);
      const { id } = resource;

      const modified = 'foo';
      expect(modified).not.toBe(resource.modified);

      await update(user, { ...resource, modified });

      const updated = await byId(user, { id });
      expect(updated.modified).not.toBe(modified);
    });

    it('should not update id', async () => {
      const user = await createUser();
      const resource = await createResource(user);
      const { id } = resource;

      const fakeId = `ABCDE${id.substring(5)}`;
      expect(fakeId).not.toBe(resource.id);

      await update(user, { ...resource, id: fakeId });

      expect(await byId(user, { id })).toBeTruthy();
      expect(await byId(user, { id: fakeId })).toBeFalsy();
    });

    it('should not update resources of other users', async () => {
      const user = await createUser();
      const resource = await createResource(user);
      const { id } = resource;

      const foo = 'text2';
      expect(foo).not.toBe(resource.foo);

      const user2 = await createUser({ email: 'bar@example.com' });

      await update(user2, { ...resource, foo });

      expect(await byId(user, { id })).toEqual(resource);
    });
  });

  describe('remove', () => {
    it('should remove a resource', async () => {
      const user = await createUser();
      const { id } = await createResource(user);

      expect((await byOwner(user)).length).toBe(1);

      await remove(user, { id });

      expect((await byOwner(user)).length).toBe(0);
    });

    it('should not remove resources of other users', async () => {
      const user = await createUser();
      const { id } = await createResource(user);

      expect((await byOwner(user)).length).toBe(1);

      const user2 = await createUser({ email: 'bar@example.com' });
      await remove(user2, { id });

      expect((await byOwner(user)).length).toBe(1);
    });
  });

  describe('require user', () => {
    it('should support un auth access', async () => {
      await dropTable(table.name);
      const model = restModel(table, { userRequired: false });
      await model.init();

      const {
        create: createUnAuth,
        byId: byIdUnAuth,
        byOwner: byOwnerUnAuth,
        update: updateUnAuth,
        remove: removeUnAuth,
      } = restController(model, { userRequired: false });

      const resource = { foo: 'bar' };
      const user = null;

      const { id } = await createUnAuth(user, resource);
      expect(await count(table.name)).toBe(1);

      const created = await byIdUnAuth(user, { id });
      expect(created).toEqual(expect.objectContaining(resource));

      try {
        await byOwnerUnAuth(user);
        expect('no owner').toBe(true);
      } catch (err) {
        expect(err).toBeTruthy();
      }

      const modified = { ...created, foo: 'baz' };
      expect(modified.foo).not.toBe(created.foo);
      await updateUnAuth(created, modified);
      const updated = await byIdUnAuth(user, { id });
      expect(updated.foo).toBe(modified.foo);

      await removeUnAuth(user, { id });
      expect(await count(table.name)).toBe(0);
    });
  });
});
