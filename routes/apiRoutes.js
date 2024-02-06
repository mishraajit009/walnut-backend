const express = require('express');
const apiController = require('../controllers/apiController');
const {authenticateTokenUser,authenticateTokenAdmin} = require('../authenticate');
const router = express.Router();

// Define API routes
router.post('/add-item',authenticateTokenAdmin,apiController.addItem);
router.get('/list-items',authenticateTokenAdmin,apiController.listItem);
router.put('/update-items',apiController.updateItem);
router.delete('/delete-item',apiController.deleteItem);

module.exports = router;
