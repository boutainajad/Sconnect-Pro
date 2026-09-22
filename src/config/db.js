// src/config/db.js
require('dotenv').config();
const { Pool } = require('pg');

console.log('DATABASE_URL =', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(client => {
    console.log('Connecte a PostgreSQL');
    client.release();
  })
  .catch(err => console.error('Erreur PostgreSQL:', err.message));

module.exports = pool;