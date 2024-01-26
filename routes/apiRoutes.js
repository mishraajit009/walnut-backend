const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

// Define API routes
router.get('/data', apiController.getData);

module.exports = router;
