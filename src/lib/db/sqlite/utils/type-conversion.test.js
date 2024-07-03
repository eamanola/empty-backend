const { validTableSchema } = require('../../../jest/test-helpers');

const { toDB, fromDB } = require('./type-conversion');

describe('sqlite type conversion', () => {
  it('should convert js types to db', async () => {
    const obj = {
      bool: true,
      date: new Date(),
      number: 1,
      string: 'string',
    };

    expect(toDB(obj)).toEqual({
      bool: 1,
      date: obj.date.toISOString(),
      number: 1,
      string: 'string',
    });
  });

  it('should convert db types to js', async () => {
    const { columns } = validTableSchema();
    const dbObj = {
      bool: 0,
      date: (new Date()).toISOString(),
      number: 1,
      string: 'string',
    };

    expect(fromDB(dbObj, columns)).toEqual({
      bool: false,
      date: new Date(dbObj.date),
      number: 1,
      string: 'string',
    });
  });

  it('should cancel eachother', () => {
    const { columns } = validTableSchema();
    const obj = {
      bool: false,
      date: new Date(),
      number: 1,
      string: 'string',
    };

    expect(fromDB(toDB(obj), columns)).toEqual(obj);
  });
});
