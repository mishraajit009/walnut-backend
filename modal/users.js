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

async function bookItems(userId, items) {
  const connection = await getConnection();
  try {
    // Start a transaction
    await connection.beginTransaction();

    // Generate an invoice number (you can use any logic for this)
    const invoiceNumber = generateInvoiceNumber();
    let total = 0;
    // Insert the booking details into the bookings table
    await connection.execute(
      'INSERT INTO bookings (invoice_no, user_id, date,total) VALUES (?, ?, NOW(),?)',
      [invoiceNumber, userId,total]
    );
    // Iterate through each item and update the quantity in the items table
    for (const item of items) {
      const [rows] = await connection.execute('SELECT * FROM items WHERE id = ?', [item.id]);
      console.log("ROWS :-",rows);
      if(item.qty > rows[0].qty){
        await connection.rollback();
        return {message:"QTY not available"}
      }
      total = (rows[0].price*item.qty) + total;
      console.log("My total is",total);
      // Subtract purchased quantity from the existing quantity
      await connection.execute(
        'UPDATE items SET qty = qty - ? WHERE id = ?',
        [item.qty, item.id]
      );

      // Insert into the items_booked table
      await connection.execute(
        'INSERT INTO items_booked (invoice_no, itemId, purchase_qty) VALUES (?, ?, ?)',
        [invoiceNumber, item.id, item.qty]
      );
      
    }
    console.log("My total is",total);
    await connection.execute(
      'UPDATE bookings SET total = ? WHERE invoice_no = ?',
      [total, invoiceNumber]
    );


    // Commit the transaction
    await connection.commit();

    return invoiceNumber;
  } catch (error) {
    // Rollback the transaction if an error occurs
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Helper function to generate a unique invoice number (you can customize this)
function generateInvoiceNumber() {
  return 'INV' + new Date().getTime();
}


module.exports = {
  getAllUsers,
  login,
  listItems,
  bookItems
};
