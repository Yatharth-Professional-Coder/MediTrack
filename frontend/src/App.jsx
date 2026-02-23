import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />; // Or unauthorized page
    }

    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['patient']}>
                        <PatientDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Doctor Routes */}
            <Route
                path="/doctor-dashboard"
                element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                        <DoctorDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
