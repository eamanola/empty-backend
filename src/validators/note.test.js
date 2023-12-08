const noteSchema = require('./note');

const validate = (note) => noteSchema.validate(note);

const validNewNote = {
  text: 'foo',
  imageUrl: 'http://example.com',
  public: false,
  owner: 'owner',
};

describe('note validation', () => {
  describe('new note', () => {
    it('should contain a valid new note', async () => {
      const noteMeta = {
        id: 'foo',
        modified: new Date(),
      };

      validate(noteMeta)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));

      const fullNote = {
        ...noteMeta,
        ...validNewNote,
      };

      expect(await validate(fullNote)).toEqual(fullNote);
    });
  });

  describe('id', () => {
    it('should be required', async () => {
      const note = {
        ...validNewNote,
        modified: new Date(),
      };

      validate(note)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });
  });

  describe('modified', () => {
    it('should be required', async () => {
      const note = {
        ...validNewNote,
        id: 'foo',
      };

      validate(note)
        .catch(({ name }) => expect(name).toMatch('ValidationError'));
    });

    it('should be a date', async () => {
      const note = {
        ...validNewNote,
        id: 'foo',
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
