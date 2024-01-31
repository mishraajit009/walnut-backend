const express = require('express');
const userRoutes = require('../controllers/userController');

const router = express.Router();

// Define API routes
router.get('/list-items-user',userRoutes.listItem);
router.post('/buy-items',userRoutes.buyItems);
module.exports = router;
