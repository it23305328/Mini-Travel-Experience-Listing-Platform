import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateListing = () => {
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Redirect if not logged in
    if (!user) {
        navigate('/login');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('http://localhost:5000/api/listings', formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="container section-py" style={{ maxWidth: '800px' }}>
            <div className="auth-card" style={{ maxWidth: '100%', padding: '0', overflow: 'hidden' }}>
                <div style={{
                    background: 'var(--color-primary)',
                    padding: '3rem',
                    color: 'var(--color-white)',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Share Your Journey</h1>
                    <p style={{ opacity: '0.8', fontStyle: 'italic' }}>Curate a premium travel experience for the community</p>
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
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
                        <div className="form-group" style={{ justifyContent: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', italic: 'italic' }}>
                                Use direct links from Unsplash or Pexels for best results.
                            </p>
                        </div>
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-full"
                        style={{ padding: '1.25rem' }}
                    >
                        {loading ? 'Creating Experience...' : 'Publish to Feed'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateListing;
