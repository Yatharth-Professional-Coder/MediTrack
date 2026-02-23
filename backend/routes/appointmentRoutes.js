const express = require('express');
const router = express.Router();
const {
    getAppointments,
    createAppointment,
    updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, checkRole } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAppointments)
    .post(protect, checkRole(['patient']), createAppointment);

router.route('/:id')
    .put(protect, checkRole(['doctor']), updateAppointmentStatus);

module.exports = router;
