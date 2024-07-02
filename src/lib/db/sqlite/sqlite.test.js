const sqlite3 = require('sqlite3');

const {
  initDB,
  connectDB,
  closeDB,
  createTable,
  insertOne,
  deleteAll,
  count,
} = require('.');

describe('API', () => {
  it('sqlite3 should have used API', async () => {
    const client = new sqlite3.Database(':memory:');
    expect(typeof client.run).toBe('function');
    expect(typeof client.get).toBe('function');
    expect(typeof client.all).toBe('function');
    expect(typeof client.close).toBe('function');

    client.close();
  });
});

describe('connection', () => {
  describe('connectDB', () => {
    it('should connect', async () => {
      await initDB(':memory:');
      await connectDB();

      await createTable('test-table', [{ name: 'foo', type: 'string' }]);

      await closeDB();
    });
  });

  describe('closeDB', () => {
    it('should disconnect', async () => {
      await initDB(':memory:');
      await connectDB();

      await createTable('test-table', [{ name: 'foo', type: 'string' }]);

      await closeDB();

      try {
        await createTable('test-table', [{ name: 'foo', type: 'string' }]);
      } catch ({ message }) {
        expect(/SQLITE_MISUSE: Database is closed/u.test(message)).toBe(true);
      }
    });
  });
});

describe('lastID', () => {
  it('is not unique', async () => {
    const table = 'test-table';
    await initDB(':memory:');
    await connectDB();
    await createTable(table, [{ name: 'foo', type: 'number' }]);

    await deleteAll(table);
    expect(await count(table)).toBe(0);
    const { lastID: firstId } = await insertOne(table, { foo: 1 });

    await deleteAll(table);
    expect(await count(table)).toBe(0);
    const { lastID: secondId } = await insertOne(table, { foo: 1 });

    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).toBe(secondId);

    await closeDB();
  });
});
