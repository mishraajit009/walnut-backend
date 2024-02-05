// Controller logic for API routes
const jwt = require('jsonwebtoken');
const usersModal = require('../modal/admin');

exports.getData = (req, res) => {
    res.json({ message: 'Hello, this is your API response!' });
};
  

exports.addItem = (req, res) => {
    res.json({ message: 'Hello, this is your API response! Add ITEMS' });
};
  

exports.listItem = async (req, res) => {
    const list_items = await usersModal.listItems();
    res.send({ products: list_items });

};
  

exports.updateItem = (req, res) => {
    res.json({ message: 'Hello, this is your API response!' });
};
  

exports.deleteItem = (req, res) => {
    res.json({ message: 'Hello, this is your API response!' });
};
  


  