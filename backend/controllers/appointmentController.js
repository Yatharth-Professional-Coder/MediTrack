const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User');


const getAppointments = asyncHandler(async (req, res) => {
    let appointments;

    if (req.user.role === 'patient') {
        appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', 'name email');
    } else if (req.user.role === 'doctor') {
        appointments = await Appointment.find({ doctor: req.user.id }).populate('patient', 'name email');
    } else {
        res.status(401);
        throw new Error('Not authorized');
    }

    res.status(200).json(appointments);
});


const createAppointment = asyncHandler(async (req, res) => {
    const { department, doctorId, date, timeSlot } = req.body;

    if (!department || !doctorId || !date || !timeSlot) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);



    const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        date: date,
        timeSlot: timeSlot,
        status: { $ne: 'rejected' }
    });

    if (existingAppointment) {
        res.status(400);
        throw new Error('Doctor is not available at this time');
    }

    const appointment = await Appointment.create({
        department,
        doctor: doctorId,
        patient: req.user.id,
        date,
        timeSlot
    });

    // return full populated appointment?
    const populatedAppointment = await Appointment.findById(appointment._id).populate('doctor', 'name');

    res.status(201).json(populatedAppointment);
});


const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    // Make sure user is the doctor of this appointment
    if (appointment.doctor.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );

    res.status(200).json(updatedAppointment);
});

module.exports = {
    getAppointments,
    createAppointment,
    updateAppointmentStatus,
};
