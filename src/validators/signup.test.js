const signupSchema = require('./signup');

const validate = (newNote) => signupSchema.validate(newNote);

describe('signup validation', () => {
  describe('email', () => {
    it('should be required', async () => {
      const signup = {
        email: '',
        password: 'bar',
      };

      validate(signup)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });

    it('should be a url email', async () => {
      const signup = {
        email: 'foo',
        password: 'bar',
      };

      validate(signup)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));

      const signup2 = {
        ...signup,
        email: 'foo@example.com',
      };

      expect(await validate(signup2)).toEqual(signup2);
    });
  });

  describe('password', () => {
    it('should be required', async () => {
      const signup = {
        email: 'foo@example.com',
        password: '',
      };

      validate(signup)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });
  });
});
