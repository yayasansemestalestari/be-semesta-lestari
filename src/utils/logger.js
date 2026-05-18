const winston = require('winston');
const config = require('../config/environment');

const isProd = config.nodeEnv === 'production';

const transports = [
  new winston.transports.Console({
    format: isProd
      ? winston.format.simple()
      : winston.format.combine(winston.format.colorize(), winston.format.simple()),
  }),
];

// File logging only in non-production to avoid filling Hostinger disk
// and to keep request I/O fast. In production, rely on hPanel's stdout capture.
if (!isProd) {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  );
}

const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'semesta-lestari-api' },
  transports,
});

module.exports = logger;
