import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 0' }}>
            <div className="container flex justify-between items-center">
                <Link to="/" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)', textDecoration: 'none' }}>
                    MediTrack
                </Link>
                <div className="flex gap-4 items-center">
                    {!user ? (
                        <>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hello, <strong>{user.name}</strong></span>
                            </div>
                            {user.role === 'patient' && (
                                <Link to="/dashboard" className="text-sm font-semibold" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Dashboard</Link>
                            )}
                            {user.role === 'doctor' && (
                                <Link to="/doctor-dashboard" className="text-sm font-semibold" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Doctor Panel</Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
