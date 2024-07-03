const supportedTypes = [
  'string',
  'number',
  'bool',
  'date',
];

const skip = (obj) => [null, undefined].includes(obj) || (typeof obj !== 'object');

const fromDB = (dbObj, columns) => {
  if (skip(dbObj)) {
    return dbObj;
  }

  const obj = Object.keys(dbObj).reduce((acc, key) => {
    let value;

    if (dbObj[key] === null) {
      value = null;
    } else {
      const { type } = columns.find(({ name }) => name === key);
      switch (type) {
        case 'string':
          value = String(dbObj[key]);
          break;

        case 'number':
          value = Number(dbObj[key]);
          break;

        case 'bool':
          value = Number(dbObj[key]) === 1;
          break;

        case 'date':
          value = new Date(dbObj[key]);
          break;

        default:
          throw new Error('Unsupported type');
      }
    }

    return { ...acc, [key]: value };
  }, {});

  return obj;
};

const toDB = (obj) => {
  if (skip(obj)) {
    return obj;
  }

  const dbObj = Object.keys(obj).reduce((acc, key) => {
    let value;

    if (obj[key] === null) {
      value = null;
    } else {
      const type = typeof obj[key];
      switch (type) {
        case 'string':
        case 'number':
          value = obj[key];
          break;

        case 'boolean':
          value = obj[key] ? 1 : 0;
          break;

        case 'object':
          if (obj[key] instanceof Date) {
            value = obj[key].toISOString();
          } else {
            throw new Error('Unsupported type');
          }
          break;

        default:
          throw new Error('Unsupported type');
      }
    }

    return { ...acc, [key]: value };
  }, {});

  return dbObj;
};

module.exports = {
  fromDB,
  supportedTypes,
  toDB,
};
