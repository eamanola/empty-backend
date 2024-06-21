const { initCache, connectCache, closeCache } = require('./lib/cache');
const { initDB, connectDB, closeDB } = require('./lib/db');
const app = require('./app');
const { PORT } = require('./config');
const logger = require('./lib/utils/logger');

const shutdown = (server) => async () => {
  await closeDB();
  logger.info('db connection closed');

  await closeCache();
  logger.info('cache connection closed');

  server.close(() => {
    logger.info('server closed');
    process.exit(0);
  });
};

const start = async () => {
  initDB();

  await connectDB();
  logger.info('DB Connected');

  await initCache();
  await connectCache();
  logger.info('Cache Connected');

  const server = app.listen(PORT, () => {
    logger.info(`Running on port ${PORT}`);
  });

  const onExit = shutdown(server);
  process.on('SIGINT', onExit);
  process.on('SIGTERM', onExit);
  process.on('SIGHUP', onExit);
};

try {
  start();
} catch (err) {
  logger.error(err);
}
