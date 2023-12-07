const { initDB, connectDB, closeDB } = require('./db');
const app = require('./app');
const { PORT } = require('./config');
const { info, err } = require('./logger');

const shutdown = (server) => async () => {
  await closeDB();
  info('db connection closed');

  server.close(() => {
    info('server closed');
    process.exit(0);
  });
};

const start = async () => {
  initDB();

  await connectDB();
  info('DB Connected');

  const server = app.listen(PORT, () => {
    info(`Running on port ${PORT}`);
  });

  const onExit = shutdown(server);
  process.on('SIGINT', onExit);
  process.on('SIGTERM', onExit);
  process.on('SIGHUP', onExit);
};

try {
  start();
} catch (e) {
  err(e);
}
