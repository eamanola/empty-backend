const noteSchema = require('./note');

const validate = (note) => noteSchema.validate(note, { strict: true });

const validNewNote = {
  text: 'foo',
  imageUrl: 'http://example.com',
  public: false,
};

describe('note validation', () => {
  describe('new note', () => {
    it('should contain a valid new note', async () => {
      const note = {
        id: 'foo',
        owner: 'bar',
        created: new Date(),
        modified: new Date(),
      };

      try {
        await validate(note);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }
    });
  });

  describe('id', () => {
    it('should be required', async () => {
      const note = {
        ...validNewNote,
        owner: 'foo',
        created: new Date(),
        modified: new Date(),
      };

      try {
        await validate(note);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }
    });
  });

  describe('owner', () => {
    it('should be required', async () => {
      const note = {
        ...validNewNote,
        id: 'foo',
        created: new Date(),
        modified: new Date(),
      };

      try {
        await validate(note);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }
    });
  });

  describe('created', () => {
    it('should be required', async () => {
      const note = {
        ...validNewNote,
        id: 'foo',
        owner: 'bar',
        modified: new Date(),
      };

      try {
        await validate(note);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }
    });

    it('should be a date', async () => {
      const note = {
        ...validNewNote,
        id: 'foo',
        owner: 'bar',
        created: '123',
        modified: new Date(),
      };

      try {
        await validate(note);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }

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
        owner: 'bar',
        created: new Date(),
      };

      try {
        await validate(note);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }
    });

    it('should be a date', async () => {
      const note = {
        ...validNewNote,
        id: 'foo',
        owner: 'bar',
        created: new Date(),
        modified: '123',
      };

      try {
        await validate(note);
        expect(true).toBe(false);
      } catch ({ name }) {
        expect(name).toBe('ValidationError');
      }

      const note2 = {
        ...note,
        modified: new Date(),
      };

      expect(await validate(note2)).toEqual(note2);
    });
  });
});
