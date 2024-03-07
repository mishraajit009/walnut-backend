const express = require('express');
const apiController = require('../controllers/apiController');
const {authenticateTokenUser,authenticateTokenAdmin} = require('../authenticate');
const router = express.Router();


router.post('/reschedule-appointment',apiController.rescheduleAppointment)
router.post('/schedule-appointment',apiController.schdeuleAppointment)
router.delete('/delete-appointment',apiController.deleteAppointment)
router.post('/add-time-slots',apiController.addTimeSlots)
router.delete('/delete-time-slots',apiController.deleteTimeSlots)
module.exports = router;