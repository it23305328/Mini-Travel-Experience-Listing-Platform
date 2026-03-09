import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

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

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await axios.get(`/api/listings/${id}`);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
            // Keep track that we are using a file now
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
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
            await axios.put(`/api/listings/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            });
            navigate(`/listings/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed. Please try again.');
            setUpdating(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="container section-py" style={{ maxWidth: '800px' }}>
            <div className="auth-card" style={{ maxWidth: '100%', padding: '0', overflow: 'hidden' }}>
                <div style={{
                    background: 'var(--primary-dark)',
                    padding: '3rem',
                    color: 'var(--white)',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Edit Your Experience</h1>
                    <p style={{ opacity: '0.8', fontStyle: 'italic' }}>Update your travel story or swap the photo</p>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
                        <div className="form-group">
                            <label htmlFor="image">1. Upload New Photo (Optional)</label>
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="imageUrl">2. OR Update URL</label>
                            <input
                                type="url"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.value) {
                                        setImageFile(null);
                                        setPreview(null);
                                    }
                                }}
                                placeholder="Link to image"
                            />
                        </div>
                    </div>

                    {(preview || formData.imageUrl) && (
                        <div className="image-preview" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current/New Preview:</p>
                            <img
                                src={preview || formData.imageUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '250px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="price">Price (USD)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Estimated cost"
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
                            placeholder="A brief hook"
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
                            required
                            rows="6"
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
                            style={{ flex: 2, background: 'var(--brand-blue)' }}
                        >
                            {updating ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditListing;
