// db.js
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost:3000',
  user: 'root',
  password: 'my-secret-pw',
  database: 'blinkit',
  connectionLimit: 10, // adjust accordingly
});

// Function to execute SQL queries
function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }

      connection.query(sql, values, (error, results) => {
        connection.release();

        if (error) {
          return reject(error);
        }

        return resolve(results);
      });
    });
  });
}

module.exports = {
  query,
};
