const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    role: {
        type: String,
        enum: ['patient', 'doctor'],
        default: 'patient'
    },
    specialization: {
        type: String,
        required: false // Only required for doctors, but handled in controller/logic
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
