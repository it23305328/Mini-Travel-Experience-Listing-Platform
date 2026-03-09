import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="nav-brand">
                    TravelExp
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                    {user ? (
                        <>
                            <Link to="/create-listing" className="nav-link">
                                Post Trip
                            </Link>
                            <span className="nav-user">Hi, {user.name}</span>
                            <button onClick={handleLogout} className="btn btn-danger">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Join Now
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
