const unverifiedEmailsSchema = require('./unverified-emails');

const validate = (newNote) => unverifiedEmailsSchema.validate(newNote);

describe('unverified validation', () => {
  describe('userId', () => {
    it('should be required', async () => {
      const obj = {
        userId: '',
        newEmail: 'bar@example.com',
      };

      validate(obj)
        .then(() => expect('Should not reach').toBe(true))
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });
  });

  describe('newEmail', () => {
    it('should be required', async () => {
      const obj = {
        userId: 'foo',
        newEmail: '',
      };

      validate(obj)
        .then(() => expect('Should not reach').toBe(true))
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });

    it('should be a url email', async () => {
      const obj = {
        userId: 'foo',
        newEmail: 'bar',
      };

      validate(obj)
        .then(() => expect('Should not reach').toBe(true))
        .catch(({ name }) => expect(name).toMatch('ValidationError'));

      const obj2 = {
        userId: 'foo',
        newEmail: 'bar@example.com',
      };

      expect(await validate(obj2)).toEqual(obj2);
    });
  });
});
