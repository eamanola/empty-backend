const { initDB, connectDB, closeDB } = require('./db');
const app = require('./app');
const { PORT } = require('./config');

const shutdown = (server) => async () => {
  await closeDB();
  // eslint-disable-next-line no-console
  console.log('db connection closed');

  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('server closed');
    process.exit(0);
  });
};

const start = async () => {
  initDB();

  await connectDB();
  // eslint-disable-next-line no-console
  console.log('DB Connected');

  const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Running on port ${PORT}`);
  });

  const onExit = shutdown(server);
  process.on('SIGINT', onExit);
  process.on('SIGTERM', onExit);
  process.on('SIGHUP', onExit);
};

try {
  start();
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
}
