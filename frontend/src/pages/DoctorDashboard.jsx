import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments');
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            fetchAppointments();
        } catch (err) {
            console.error('Error updating status', err);
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
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Doctor Dashboard - {user.specialization}</h1>
                    <p className="text-sm text-muted">Manage patient appointment requests.</p>
                </div>

                <h3 className="mb-4" style={{ fontSize: '1.4rem' }}>Appointment Requests</h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {appointments.map(apt => (
                        <div key={apt._id} className="card flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <div className="flex gap-2 items-center mb-2">
                                    <span className="font-semibold">{apt.patient?.name || 'Unknown Patient'}</span>
                                    <span className={`badge badge-${apt.status === 'approved' ? 'success' : apt.status === 'rejected' ? 'error' : 'warning'}`}>
                                        {apt.status}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <p className="mb-1"><strong>Dept:</strong> {apt.department}</p>
                                    <p><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()} | {apt.timeSlot}</p>
                                </div>
                            </div>

                            {apt.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary"
                                        style={{ backgroundColor: 'var(--success)', padding: '0.4rem 0.8rem' }}
                                        onClick={() => handleStatusUpdate(apt._id, 'approved')}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        style={{ padding: '0.4rem 0.8rem' }}
                                        onClick={() => handleStatusUpdate(apt._id, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {appointments.length === 0 && (
                        <div className="card text-center">
                            <p className="text-muted">No pending requests.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
