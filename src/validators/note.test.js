const noteSchema = require('./note');

const validate = (note) => noteSchema.validate(note, { strict: true });

const validNewNote = {
  text: 'foo',
  imageUrl: 'http://example.com',
  public: false,
  owner: 'owner',
};

describe('note validation', () => {
  describe('new note', () => {
    it('should contain a valid new note', async () => {
      const note = {
        id: 'foo',
        created: new Date(),
        modified: new Date(),
      };

      validate(note)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });
  });

  describe('id', () => {
    it('should be required', async () => {
      const note = {
        ...validNewNote,
        created: new Date(),
        modified: new Date(),
      };

      validate(note)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });
  });

  describe('created', () => {
    it('should be required', async () => {
      const note = {
        ...validNewNote,
        id: 'foo',
        modified: new Date(),
      };

      validate(note)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });

    it('should be a date', async () => {
      const note = {
        ...validNewNote,
        id: 'foo',
        created: '123',
        modified: new Date(),
      };

      validate(note)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));

      const note2 = {
        ...note,
        created: new Date(),
      };

      expect(await validate(note2)).toEqual(note2);
    });
  });

  describe('modified', () => {
    it('should be required', async () => {
      const note = {
        ...validNewNote,
        id: 'foo',
        created: new Date(),
      };

      validate(note)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });

    it('should be a date', async () => {
      const note = {
        ...validNewNote,
        id: 'foo',
        created: new Date(),
        modified: '123',
      };

      validate(note)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));

      const note2 = {
        ...note,
        modified: new Date(),
      };

      expect(await validate(note2)).toEqual(note2);
    });
  });
});
