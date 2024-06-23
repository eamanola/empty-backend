const app = require('../lib/app');

const noteErrorHandler = require('./middlewares/note-error-handler');
const { router: notes } = require('./routes/notes');
const publicNotes = require('./routes/public-notes');

app.use('/notes', notes);
app.get('/public-notes', publicNotes);

app.use(noteErrorHandler);

module.exports = app;
