const newNoteSchema = require('./note');

const validate = (newNote) => newNoteSchema.validate(newNote);

describe('new note validation', () => {
  describe('text', () => {
    it('should be required', async () => {
      const newNote = {
        imageUrl: null,
        isPublic: false,
        text: '',
      };

      validate(newNote)
        .then(() => expect(false).toBe(true))
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });
  });

  describe('imageUrl', () => {
    it('should not be required', async () => {
      const newNote = {
        isPublic: false,
        text: 'foo',
      };

      expect(await validate(newNote)).toEqual(newNote);
    });

    it('should be a valid url', async () => {
      const newNote = {
        imageUrl: 'a',
        isPublic: false,
        text: 'foo',
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
        imageUrl: '',
        text: 'foo',
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
});
