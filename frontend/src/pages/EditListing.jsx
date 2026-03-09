import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditListing = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        imageUrl: '',
        shortDescription: '',
        fullDescription: '',
        price: '',
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/listings/${id}`);
                const listing = response.data;

                // Verify if logged in user is the creator
                if (listing.creator._id !== user._id) {
                    navigate('/');
                    return;
                }

                setFormData({
                    title: listing.title,
                    location: listing.location,
                    imageUrl: listing.imageUrl,
                    shortDescription: listing.shortDescription,
                    fullDescription: listing.fullDescription,
                    price: listing.price || '',
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch listing details.');
                setLoading(false);
            }
        };

        if (user) {
            fetchListing();
        } else {
            navigate('/login');
        }
    }, [id, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(null);

        try {
            await axios.put(`http://localhost:5000/api/listings/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            navigate(`/listings/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed. Please try again.');
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="loading-spinner">
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="container section-py" style={{ maxWidth: '800px' }}>
            <div className="auth-card" style={{ maxWidth: '100%', padding: '0', overflow: 'hidden' }}>
                <div style={{
                    background: 'var(--color-primary)',
                    padding: '3rem',
                    color: 'var(--color-white)',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Edit Your Experience</h1>
                    <p style={{ opacity: '0.8', fontStyle: 'italic' }}>Update your travel story for the community</p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '3rem' }}>
                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Midnight in Paris"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. France"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUrl">Image URL</label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="Link to a stunning high-res image"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price (USD)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Estimated cost per person"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="shortDescription">Short Description</label>
                        <input
                            type="text"
                            id="shortDescription"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            placeholder="A brief hook for your trip"
                            maxLength="150"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullDescription">Full Journey Details</label>
                        <textarea
                            id="fullDescription"
                            name="fullDescription"
                            value={formData.fullDescription}
                            onChange={handleChange}
                            placeholder="Describe every detail of your experience..."
                            required
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate(`/listings/${id}`)}
                            className="btn btn-danger"
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updating}
                            className="btn btn-primary"
                            style={{ flex: 2 }}
                        >
                            {updating ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditListing;
