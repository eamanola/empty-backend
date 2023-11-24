const { connectDB, closeDB } = require('./mongo');

connectDB()
  .then(() => console.log('DB Connected'))
  .catch(console.error)
  .finally(closeDB);
