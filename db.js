// db.js

const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'my-secret-pw',
  database: 'blinkit'
});

module.exports = pool;
