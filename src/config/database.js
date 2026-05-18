const mysql = require('mysql2/promise');
const config = require('./environment');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  port: config.database.port,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 20,
  connectTimeout: 10000,
  enableKeepAlive: false,
  // mysql2 specific: kill connection if idle too long so we don't pile up
  // dead sockets when Hostinger drops them mid-life
  idleTimeout: 60000,
});

pool.on('connection', (connection) => {
  connection.on('error', (err) => {
    logger.error('MySQL connection error (will be removed from pool):', {
      code: err.code,
      message: err.message,
    });
  });
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    logger.error('Database connection failed:', {
      code: error.code,
      message: error.message,
    });
    return false;
  }
};

module.exports = { pool, testConnection };
