import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/cards.css';

const Profile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setProfileData(response.data);
                setFormData(prev => ({ ...prev, name: response.data.user.name }));
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile.');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError(null);
        setUpdateSuccess(false);

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setUpdateLoading(true);
        try {
            const updatePayload = { name: formData.name };
            if (formData.password) {
                updatePayload.password = formData.password;
            }

            const response = await axios.put('http://localhost:5000/api/users/profile', updatePayload, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            // Update AuthContext user info (token remains the same)
            login({ ...user, name: response.data.name });
            setUpdateSuccess(true);
            setUpdateLoading(false);
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
            setUpdateLoading(false);
        }
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    if (loading) return (
        <div className="loading-spinner">
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="container section-py">
            <h1 className="page-title">User Profile</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' }}>
                {/* Section 2: Edit Profile */}
                <div className="auth-card" style={{ maxWidth: '100%', position: 'sticky', top: '120px' }}>
                    <div className="auth-header">
                        <h2>Personal Details</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your account information</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    {updateSuccess && <div className="alert" style={{ background: '#f0fdf4', color: '#166534' }}>Profile updated successfully!</div>}

                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div style={{ marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Change Password</h3>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={updateLoading} className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
                            {updateLoading ? 'Saving...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Section 1: My Listings */}
                <div>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-dark)' }}>My Travel Stories</h2>
                        <span style={{ background: 'var(--primary-dark)', color: 'var(--white)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.875rem', fontWeight: '700' }}>
                            {profileData?.listings.length} Posts
                        </span>
                    </div>

                    {profileData?.listings.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {profileData.listings.map((listing) => (
                                <Link to={`/listings/${listing._id}`} key={listing._id}>
                                    <div className="card-listing">
                                        <div className="card-image-wrapper" style={{ height: '200px' }}>
                                            <img src={listing.imageUrl} alt={listing.title} className="card-image" />
                                            <div className="card-badge" style={{ top: '1rem', left: '1rem' }}>{listing.location}</div>
                                        </div>
                                        <div className="card-content" style={{ padding: '1.5rem' }}>
                                            <h3 className="card-title" style={{ fontSize: '1.125rem' }}>{listing.title}</h3>
                                            <p className="card-desc" style={{ fontSize: '0.875rem', margin: '0.5rem 0 1rem 0' }}>{listing.shortDescription}</p>
                                            <div className="card-footer" style={{ padding: '0.75rem 0 0 0' }}>
                                                <span className="card-time" style={{ fontSize: '0.7rem' }}>{timeAgo(listing.createdAt)}</span>
                                                {listing.price && <span className="card-price" style={{ fontSize: '1rem' }}>${listing.price}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-subtle)' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't shared any experiences yet.</p>
                            <Link to="/create-listing" className="btn btn-primary">Share Your First Trip</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
