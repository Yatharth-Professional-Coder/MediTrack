const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    department: {
        type: String,
        required: [true, 'Please select a department']
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: [true, 'Please select a date']
    },
    timeSlot: {
        type: String,
        required: [true, 'Please select a time slot']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
