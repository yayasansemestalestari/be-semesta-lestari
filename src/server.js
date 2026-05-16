require('dotenv').config();

const express = require('express');
const { testConnection } = require('./config/database');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    const result = await testConnection();
    console.log('DB RESULT:', result);
  } catch (err) {
    console.error('DB ERROR:', err);
  }
});
