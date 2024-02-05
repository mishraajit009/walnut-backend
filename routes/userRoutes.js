const express = require('express');
const userRoutes = require('../controllers/userController');
const {authenticateTokenUser,authenticateTokenAdmin} = require('../authenticate');
const router = express.Router();

// Define API routes
router.get('/list-items-user',authenticateTokenUser,userRoutes.listItem);
router.post('/buy-items',authenticateTokenUser,userRoutes.buyItems);
router.post('/login',userRoutes.login);
module.exports = router;
