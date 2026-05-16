require('dotenv').config();

const app = require('./app');
const config = require('./config/environment');
const { testConnection } = require('./config/database');
const logger = require('./utils/logger');

const PORT = config.port || process.env.PORT || 3000;

// Start Express server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📚 API Documentation: /api-docs`);
  logger.info(`🏥 Health Check: /api/health`);
  logger.info(`🌍 Environment: ${config.nodeEnv || process.env.NODE_ENV}`);
  
  connectDatabase();
});

// Handle server listen errors
server.on('error', (err) => {
  logger.error('Server Error:', err);
});

// Connect database separately
async function connectDatabase() {
  try {
    logger.info('🔄 Connecting to database...');

    const dbConnected = await testConnection();

    if (dbConnected) {
      logger.info('✅ Database connected successfully');
    } else {
      logger.error('❌ Failed to connect to database');
    }
  } catch (error) {
    logger.error('❌ Database connection error:', error);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
