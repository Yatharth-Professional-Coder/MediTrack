const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://medi-track-furznnikq-yatharths-projects-3499ff01.vercel.app', 'https://medi-track-coral.vercel.app'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
