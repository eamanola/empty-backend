const newNoteSchema = require('./note');

const validate = (newNote) => newNoteSchema.validate(newNote);

describe('new note validation', () => {
  describe('text', () => {
    it('should be required', async () => {
      const newNote = {
        text: '',
        imageUrl: null,
        isPublic: false,
        owner: 'owner',
      };

      validate(newNote)
        .then(() => expect(false).toBe(true))
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });
  });

  describe('imageUrl', () => {
    it('should not be required', async () => {
      const newNote = {
        text: 'foo',
        isPublic: false,
        owner: 'owner',
      };

      expect(await validate(newNote)).toEqual(newNote);
    });

    it('should be a valid url', async () => {
      const newNote = {
        text: 'foo',
        imageUrl: 'a',
        owner: 'owner',
        isPublic: false,
      };

      validate(newNote)
        .then(() => expect(false).toBe(true))
        .catch(({ name }) => expect(name).toMatch('ValidationError'));

      const newNote2 = {
        ...newNote,
        imageUrl: 'http://www.example.com',
      };

      expect(await validate(newNote2)).toEqual(newNote2);
    });
  });

  describe('isPublic', () => {
    it('should be required', async () => {
      const newNote = {
        text: 'foo',
        imageUrl: '',
        owner: 'owner',
      };

      validate(newNote)
        .then(() => expect('Should not reach').toBe(true))
        .catch(({ name }) => expect(name).toMatch('ValidationError'));

      const newNote2 = {
        ...newNote,
        isPublic: false,
      };

      expect(await validate(newNote2)).toEqual(newNote2);
    });
  });

  describe('owner', () => {
    it('should be required', async () => {
      const newNote = {
        text: 'foo',
        imageUrl: '',
        owner: '',
      };

      validate(newNote)
        .then(() => expect('Should not reach').toBe(true))
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });
  });
});
