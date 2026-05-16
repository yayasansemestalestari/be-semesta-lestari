require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

const PORT = process.env.PORT || 3000;

console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ DATABASE CONNECTED');

    await connection.end();
  } catch (error) {
    console.error('❌ DATABASE ERROR');
    console.error(error);
  }
});
