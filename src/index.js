const { connectDB, closeDB } = require('./mongo');

connectDB()
  // eslint-disable-next-line no-console
  .then(() => console.log('DB Connected'))
  // eslint-disable-next-line no-console
  .catch(console.error)
  .finally(closeDB);
