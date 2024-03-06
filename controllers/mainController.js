// Controller logic for API routes
const jwt = require('jsonwebtoken');
const adminModal = require('../modal/admin');
const { v4: uuidv4 } = require('uuid');
  

exports.addItem = async (req, res) => {
   const id = uuidv4();
   if(!req.body.name || !req.body.price || !req.body.qty){
    return res.status(400).send({message:"ADD item needs NAME, PRICE, QTY"});
   }
    try{
        const product = {}
        product.name = req.body.name
        product.price = req.body.price
        product.qty = req.body.qty
        product.id = id
        const added_Item = await adminModal.addItem(product);
        return res.send({ message:added_Item});
    }catch (error){
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
  

exports.listItem = async (req, res) => {
    try{
        const list_items = await adminModal.listItems();
        res.send({ products: list_items });
    } catch(error){
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
  

exports.updateItem = async (req, res) => {
    const itemId = req.query.id;
    if(!req.query.id || !req.body.name || !req.body.price || !req.body.qty){
        res.status(400).json({ success: false, message: 'Invalid Request body',
        error: "Please add {name, price, and qty} and id params" });
    }
    const updatedData = req.body;
    try {
      const result = await adminModal.updateItem(itemId, updatedData);
      res.json({ success: true, message: 'Item updated successfully', result });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
  

exports.deleteItem = async (req, res) => {
    const id = req.query.id
    try{
        
        const deleted_count = await adminModal.deleteItem(id);
        return res.status(200).send({ message: deleted_count });
    } catch(error){
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

