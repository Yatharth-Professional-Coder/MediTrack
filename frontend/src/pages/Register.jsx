import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, 'patient', '');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
                <div className="card" style={{ width: '100%', maxWidth: '440px' }}>
                    <h2 className="text-center mb-4">Register</h2>
                    {error && <div className="mb-4 text-center" style={{ color: 'var(--error)' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                className="input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">Password</label>
                            <input
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Register</button>
                    </form>
                    <p className="text-center mt-4 text-sm">
                        Already have an account? <a href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
