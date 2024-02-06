const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'my-secret-pw',
  database: 'blinkit',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Error getting database connection:', error);
    throw error; // Rethrow the error for higher-level handling
  }
};

module.exports = { getConnection };