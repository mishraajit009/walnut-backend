// user.js (example model)

const db = require('../db');

function getAllUsers(callback) {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
}

module.exports = {
  getAllUsers
};
