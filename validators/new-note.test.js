const newNoteSchema = require('./new-note');

const validate = (newNote) => newNoteSchema.validate(newNote, { strict: true });

describe('new note validation', () => {
  describe('text', () => {
    it('should be required', async () => {
      const newNote = {
        text: '',
        imageUrl: null,
        public: false,
      };

      try {
        await validate(newNote);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }
    });
  });

  describe('imageUrl', () => {
    it('should not be required', async () => {
      const newNote = {
        text: 'foo',
        public: false,
      };

      expect(await validate(newNote)).toEqual(newNote);
    });

    it('should be a valid url', async () => {
      const newNote = {
        text: 'foo',
        imageUrl: 'a',
        public: false,
      };

      try {
        await validate(newNote);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }

      const newNote2 = {
        ...newNote,
        imageUrl: 'http://www.example.com',
      };

      expect(await validate(newNote2)).toEqual(newNote2);
    });
  });

  describe('public', () => {
    it('should be required', async () => {
      const newNote = {
        text: 'foo',
        imageUrl: '',
      };

      try {
        await validate(newNote);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }

      const newNote2 = {
        ...newNote,
        public: false,
      };

      expect(await validate(newNote2)).toEqual(newNote2);
    });
  });
});
