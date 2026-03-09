import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
            });
            login(response.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-split-container">
            {/* Left Side: Travelista Tours Branding */}
            <div className="auth-left-side" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}>
                <h1 className="auth-brand-name">Travelista Tours</h1>
                <p className="auth-quote">
                    "Collect moments, not things. Your next big adventure starts right here."
                </p>
            </div>

            {/* Right Side: Register Form */}
            <div className="auth-right-side">
                <div className="auth-form-wrapper">
                    <h2 className="auth-welcome-title">Welcome</h2>
                    <p className="auth-welcome-sub">Create an account to explore the world</p>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-input-group">
                            <span className="auth-input-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </span>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-input-group">
                            <span className="auth-input-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-input-group">
                            <span className="auth-input-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="auth-input"
                            />
                        </div>

                        <button type="submit" className="btn-auth">
                            REGISTER
                        </button>

                        <p className="auth-redirect">
                            Already have an account?
                            <Link to="/login" className="auth-redirect-link">Login Now</Link>
                        </p>
                    </form>
                </div>

                {/* Skyline Illustration (Bottom Watermark) */}
                <img
                    src="https://images.unsplash.com/photo-1549413222-386d38e78049?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    className="auth-skyline"
                    alt="Skyline"
                />
            </div>
        </div>
    );
};

export default Register;
