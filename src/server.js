require("dotenv").config();

const app = require("./app");
const config = require("./config/environment");
const { testConnection } = require("./config/database");
const logger = require("./utils/logger");

const PORT = config.port || process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📚 API Documentation: /api-docs`);
  logger.info(`🏥 Health Check: /api/health`);
  logger.info(`🌍 Environment: ${config.nodeEnv || process.env.NODE_ENV}`);

  initializeApp();
});

// Bound socket timeouts so a stuck upstream (slow MySQL, hanging multer)
// doesn't pin a connection forever on shared hosting where sockets are scarce.
server.keepAliveTimeout = 65 * 1000;
server.headersTimeout = 70 * 1000;
server.requestTimeout = 60 * 1000;

async function initializeApp() {
  try {
    logger.info("🔄 Connecting to database...");
    let dbConnected = false;
    for (let attempt = 1; attempt <= 3 && !dbConnected; attempt += 1) {
      dbConnected = await testConnection();
      if (!dbConnected) {
        logger.warn(`DB connect attempt ${attempt} failed, retrying...`);
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
    if (!dbConnected) {
      logger.error("❌ DB unreachable after retries — server still listening, /ping will respond.");
      return;
    }
    logger.info("✅ Database connected");
  } catch (error) {
    logger.error("❌ Initialization error:", error);
  }
}

server.on("error", (err) => {
  logger.error("Server Error:", err);
});

// Keep process alive on unexpected errors. On shared hosting a crash means
// cold-start on the next request, which the user sees as a 503.
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", err);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
});

const shutdown = (signal) => {
  logger.info(`${signal} received`);
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
