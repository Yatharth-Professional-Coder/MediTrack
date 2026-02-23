import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'doctor') {
                navigate('/doctor-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <div className="mb-4 text-center" style={{ color: 'var(--error)' }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="label">Email</label>
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
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Login</button>
                    </form>
                    <p className="text-center mt-4 text-sm">
                        Don't have an account? <a href="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
