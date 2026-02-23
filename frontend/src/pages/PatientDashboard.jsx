import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]); 
 

    const [formData, setFormData] = useState({
        department: '',
        doctorId: '',
        date: '',
        timeSlot: ''
    });
    const [message, setMessage] = useState('');

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments');
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/auth/doctors');
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments', formData);
            setMessage('Appointment booked successfully!');
            fetchAppointments();
            setFormData({ department: '', doctorId: '', date: '', timeSlot: '' });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error booking appointment');
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case 'approved': return 'var(--success-color)';
            case 'rejected': return 'var(--error-color)';
            default: return 'var(--warning-color)';
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="mb-4">
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Patient Dashboard</h1>
                    <p className="text-sm text-muted">Manage your health appointments and schedule.</p>
                </div>

                <div className="card mb-4">
                    <div className="card-header">
                        <h3 style={{ fontSize: '1.25rem' }}>Book an Appointment</h3>
                    </div>
                    {message && <div className="mb-4 text-sm font-semibold" style={{ color: message.includes('success') ? 'var(--success)' : 'var(--error)' }}>{message}</div>}
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                        <div className="input-group">
                            <label className="label">Department</label>
                            <select
                                className="input"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value, doctorId: '' })}
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="General">General</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="label">Doctor</label>
                            <select
                                className="input"
                                value={formData.doctorId}
                                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                required
                                disabled={!formData.department}
                            >
                                <option value="">{formData.department ? 'Select Doctor' : 'First Select Department'}</option>
                                {doctors
                                    .filter(doc => {
                                        const mapping = {
                                            'Cardiology': 'Cardiologist',
                                            'Neurology': 'Neurologist',
                                            'Orthopedics': 'Orthopedic',
                                            'Pediatrics': 'Pediatrician',
                                            'General': 'General Physician'
                                        };
                                        return doc.specialization === mapping[formData.department];
                                    })
                                    .map(doc => (
                                        <option key={doc._id} value={doc._id}>{doc.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="label">Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">Time Slot</label>
                            <select
                                className="input"
                                value={formData.timeSlot}
                                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                                required
                            >
                                <option value="">Select Time</option>
                                <option value="09:00 - 10:00">09:00 - 10:00 AM</option>
                                <option value="10:00 - 11:00">10:00 - 11:00 AM</option>
                                <option value="11:00 - 12:00">11:00 - 12:00 AM</option>
                                <option value="14:00 - 15:00">02:00 - 03:00 PM</option>
                                <option value="15:00 - 16:00">03:00 - 04:00 PM</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Book Appointment</button>
                        </div>
                    </form>
                </div>

                <h3 className="mb-4" style={{ fontSize: '1.4rem' }}>My Appointments</h3>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {appointments.map(apt => (
                        <div key={apt._id} className="card">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold">{apt.department}</span>
                                <span className={`badge badge-${apt.status === 'approved' ? 'success' : apt.status === 'rejected' ? 'error' : 'warning'}`}>
                                    {apt.status}
                                </span>
                            </div>
                            <div className="text-sm">
                                <p className="mb-2"><strong>Doctor:</strong> {apt.doctor?.name || 'Assigned'}</p>
                                <p className="mb-2"><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {apt.timeSlot}</p>
                            </div>
                        </div>
                    ))}
                    {appointments.length === 0 && (
                        <div className="card text-center" style={{ gridColumn: ' 1 / -1', padding: '2rem' }}>
                            <p className="text-muted">No appointments scheduled.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
