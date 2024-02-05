// user.js (example model)

const db = require('../db');
const { getConnection } = require('../db');

function getAllAdmin(callback) {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
}

async function listItems(){
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM items');
    return rows;
  } finally {
    connection.release();
  }
}

module.exports = {
  getAllAdmin,
  listItems
};
