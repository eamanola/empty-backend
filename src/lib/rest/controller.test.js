const { string, object } = require('yup');

const { createUser, deleteUsers } = require('../jest/test-helpers');

const { deleteAll, count } = require('../db');

const restController = require('./controller');

const table = 'test';

const validator = object({ foo: string().required() }).noUnknown().strict();

const {
  create,
  byId,
  byOwner,
  update,
  remove,
} = restController(null, { table, validator });

const createResource = async (user) => {
  const resource = { foo: 'bar' };
  return create(user, resource);
};

describe('rest controller', () => {
  beforeEach(async () => {
    await deleteAll(table);
    await deleteUsers();
  });

  describe('create', () => {
    it('should create one', async () => {
      const user = await createUser();
      const resource = { foo: 'bar' };

      expect(await count(table)).toBe(0);

      const id = await create(user, resource);

      expect(await count(table)).toBe(1);
      expect(await byId(user, { id })).toEqual(expect.objectContaining({ ...resource, id }));
    });

    it('should override owner', async () => {
      const user = await createUser();
      const resource = { foo: 'bar' };

      const fakeOwner = '1234';

      const id = await create(user, {
        ...resource,
        owner: fakeOwner,
      });

      const inserted = await byId(user, { id });
      expect(inserted.owner).not.toBe(fakeOwner);
      expect(inserted.owner).toBe(user.id);
    });
  });

  describe('byId', () => {
    it('should find by id', async () => {
      const user = await createUser();
      const resource = { foo: 'bar' };
      const id = await create(user, resource);

      const noteById = await byId(user, { id });

      expect(noteById).toEqual(expect.objectContaining({ ...resource, id }));
    });

    it('should not return notes of other users', async () => {
      const user = await createUser();
      const user2 = await createUser({ email: 'bar@example.com' });

      const id = await createResource(user);

      expect(await byId(user, { id })).toBeTruthy();
      expect(await byId(user2, { id })).toBeFalsy();
    });
  });

  describe('byOwner', () => {
    it('should find all user notes', async () => {
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

    it('should not return notes of other users', async () => {
      const user = await createUser();
      await createResource(user);

      const user2 = await createUser({ email: 'bar@example.com' });
      await createResource(user2);

      expect(await count(table)).toBe(2);

      const results = await byOwner(user);

      expect(results.length).toBe(1);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const user = await createUser();
      const id = await createResource(user);
      const resource = await byId(user, { id });

      const foo = 'text2';
      expect(foo).not.toBe(resource.foo);

      await update(
        user,
        { ...resource, foo },
      );

      const updated = await byId(user, { id });

      expect(updated.foo).toBe(foo);
      expect((await byOwner(user)).length).toBe(1);
    });

    it('should not update owner', async () => {
      const user = await createUser();
      const id = await createResource(user);
      const resource = await byId(user, { id });

      const fakeOwner = 'foo';
      expect(fakeOwner).not.toBe(resource.owner);

      await update(
        user,
        { ...resource, owner: fakeOwner },
      );

      const updated = await byId(user, { id });
      expect(updated.owner).toBe(resource.owner);
    });

    it('should not update modified', async () => {
      const user = await createUser();
      const id = await createResource(user);
      const resource = await byId(user, { id });

      const modified = 'foo';
      expect(modified).not.toBe(resource.modified);

      await update(
        user,
        { ...resource, modified },
      );

      const updated = await byId(user, { id });
      expect(updated.modified).not.toBe(modified);
    });

    it('should not update id', async () => {
      const user = await createUser();
      const id = await createResource(user);
      const resource = await byId(user, { id });

      const fakeId = `ABCDE${id.substring(5)}`;
      expect(fakeId).not.toBe(resource.id);

      await update(
        user,
        { ...resource, id: fakeId },
      );

      expect(await byId(user, { id })).toBeTruthy();
      expect(await byId(user, { id: fakeId })).toBeFalsy();
    });

    it('should not update notes of other users', async () => {
      const user = await createUser();
      const id = await createResource(user);
      const resource = await byId(user, { id });

      const foo = 'text2';
      expect(foo).not.toBe(resource.foo);

      const user2 = await createUser({ email: 'bar@example.com' });

      await update(
        user2,
        { ...resource, foo },
      );

      expect(await byId(user, { id })).toEqual(resource);
    });
  });

  describe('remove', () => {
    it('should remove a note', async () => {
      const user = await createUser();
      const id = await createResource(user);

      expect((await byOwner(user)).length).toBe(1);

      await remove(user, { id });

      expect((await byOwner(user)).length).toBe(0);
    });

    it('should not remove notes of other users', async () => {
      const user = await createUser();
      const id = await createResource(user);

      expect((await byOwner(user)).length).toBe(1);

      const user2 = await createUser({ email: 'bar@example.com' });
      await remove(user2, { id });

      expect((await byOwner(user)).length).toBe(1);
    });
  });

  describe('require user', () => {
    it('should support un auth access', async () => {
      const {
        create: createUnAuth,
        byId: byIdAuth,
        update: updateUnAuth,
        remove: removeUnAuth,
      } = restController(null, { table, userRequired: false, validator });

      const resource = { foo: 'bar' };
      const user = null;

      const id = await createUnAuth(user, resource);
      expect(await count(table)).toBe(1);

      const created = await byIdAuth(user, { id });
      expect(created).toEqual(expect.objectContaining(resource));

      const modified = { ...created, foo: 'baz' };
      expect(modified.foo).not.toBe(created.foo);
      await updateUnAuth(created, modified);
      const updated = await byIdAuth(user, { id });
      expect(updated.foo).toBe(modified.foo);

      await removeUnAuth(user, { id });
      expect(await count(table)).toBe(0);
    });
  });
});
