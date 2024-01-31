const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

// Define API routes
router.get('/data', apiController.getData);
router.post('/add-item',apiController.addItem);
router.get('/list-items',apiController.listItem);
router.put('/update-items',apiController.updateItem);
router.delete('/delete-item',apiController.deleteItem);

module.exports = router;
