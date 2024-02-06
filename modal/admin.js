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

async function addItem(data){
  const connection = await getConnection();
  try {
    const sqlData = [data.id,data.name, data.price, data.qty];
    
    // Construct the SQL query
    const [rows] = await connection.execute('INSERT INTO items (id,name, price, qty) VALUES (?, ?, ?, ?)', sqlData)
    return rows;
  } finally {
    connection.release();
  }
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

async function deleteItem(id) {
  const connection = await getConnection();
  try {
    // Use the DELETE SQL statement to delete the item with the specified ID
    const [rows] = await connection.execute('DELETE FROM items WHERE id = ?', [id]);
    return rows;
  } finally {
    connection.release();
  }
}

async function updateItem(id,data) {
  const connection = await getConnection();
  try {
    // Use the DELETE SQL statement to delete the item with the specified ID
    const [rows] = await connection.execute('UPDATE items SET name = ?, price = ?, qty = ? WHERE id = ?', [
      data.name,
      data.price,
      data.qty,
      id
    ])
    return rows;
  } finally {
    connection.release();
  }
}


module.exports = {
  getAllAdmin,
  addItem,
  listItems,
  deleteItem,
  updateItem
};
