const express = require('express');
const apiController = require('../controllers/apiController');
const {authenticateTokenUser,authenticateTokenAdmin} = require('../authenticate');
const router = express.Router();

// Define API routes
// router.post('/add-item',authenticateTokenAdmin,apiController.addItem);
// router.get('/list-items',authenticateTokenAdmin,apiController.listItem);
// router.put('/update-items',authenticateTokenAdmin,apiController.updateItem);
// router.delete('/delete-item',authenticateTokenAdmin,apiController.deleteItem);
router.post('/reschedule-appointment',apiController.rescheduleAppointment)
router.post('/schedule-appointment',apiController.schdeuleAppointment)
router.delete('/delete-appointment',apiController.deleteAppointment)
router.post('/add-time-slots',apiController.addTimeSlots)
router.delete('/delete-time-slots',apiController.deleteTimeSlots)
module.exports = router;