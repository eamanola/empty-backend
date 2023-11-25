const signupSchema = require('./signup');

const validate = (newNote) => signupSchema.validate(newNote, { strict: true });

describe('signup validation', () => {
  describe('email', () => {
    it('should be required', async () => {
      const signup = {
        email: '',
        password: 'bar',
      };

      try {
        await validate(signup);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }
    });

    it('should be a url email', async () => {
      const signup = {
        email: 'foo',
        password: 'bar',
      };

      try {
        await validate(signup);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }

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

      try {
        await validate(signup);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }
    });
  });
});
