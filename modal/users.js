// user.js (example model)

const { getConnection } = require('../db');

async function getAllUsers(callback) {
  const connection = await getConnection();
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
}

async function listItems(){
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT id,name,price FROM items');
    return rows;
  } finally {
    connection.release();
  }
}

async function login(user,password){
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute('SELECT userId,role FROM users WHERE userId = ? AND password = ?', [user, password]);
    return rows;
  } finally {
    connection.release();
  }
}

module.exports = {
  getAllUsers,
  login,
  listItems
};
