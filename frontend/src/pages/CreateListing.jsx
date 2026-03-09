import React, { useState, useEffect } from 'react';
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

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
            // Clear URL if file is selected to avoid confusion
            setFormData(prev => ({ ...prev, imageUrl: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile && !formData.imageUrl) {
            setError('Please upload an image OR provide an image URL.');
            return;
        }

        setLoading(true);
        setError(null);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('location', formData.location);
        data.append('shortDescription', formData.shortDescription);
        data.append('fullDescription', formData.fullDescription);
        data.append('price', formData.price);

        if (imageFile) {
            data.append('image', imageFile);
        } else {
            data.append('imageUrl', formData.imageUrl);
        }

        try {
            await axios.post('/api/listings', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            });
            navigate('/');
        } catch (err) {
            console.error('Submission Error:', err);
            const message = err.response?.data?.message || err.message || 'Something went wrong. Please try again.';
            setError(message);
            setLoading(false);
        }
    };

    return (
        <div className="container section-py" style={{ maxWidth: '800px' }}>
            <div className="auth-card" style={{ maxWidth: '100%', padding: '0', overflow: 'hidden' }}>
                <div style={{
                    background: 'var(--brand-blue)',
                    padding: '3rem',
                    color: 'var(--white)',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Share Your Journey</h1>
                    <p style={{ opacity: '0.8', fontStyle: 'italic' }}>Upload photo OR paste an image URL</p>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label htmlFor="image">1. Upload Experience Photo</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    padding: '0.5rem',
                                    border: '2px dashed #cbd5e1',
                                    background: '#f8fafc',
                                    cursor: 'pointer'
                                }}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Recommended: JPG/PNG under 5MB</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="imageUrl">2. OR Paste Image URL</label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.value) {
                                        setImageFile(null);
                                        setPreview(e.target.value);
                                    }
                                }}
                                placeholder="Paste link here instead"
                            />
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Use direct links for best results</p>
                        </div>
                    </div>

                    {(preview || formData.imageUrl) && (
                        <div className="image-preview" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Visual Preview:</p>
                            <img
                                src={preview || formData.imageUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                                }}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="price">Price (USD Amount)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="e.g. 500"
                            required
                        />
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Enter numbers only (e.g., 250)</p>
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
                            rows="6"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-full"
                        style={{ padding: '1.25rem', height: 'auto', background: 'var(--brand-blue)', fontSize: '1.1rem' }}
                    >
                        {loading ? 'Processing & Publishing...' : 'Publish to Feed'}
                    </button>

                    {loading && (
                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <div className="spinner" style={{ margin: '0 auto' }}></div>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Finalizing your travel experience...
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateListing;
