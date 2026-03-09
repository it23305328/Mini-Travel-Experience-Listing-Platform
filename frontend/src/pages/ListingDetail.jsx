import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/cards.css';

const ListingDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/listings/${id}`);
                setListing(response.data);
                setLoading(false);
            } catch (err) {
                setError('Listing not found or failed to load.');
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await axios.delete(`http://localhost:5000/api/listings/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                navigate('/');
            } catch (err) {
                alert('Failed to delete listing.');
            }
        }
    };

    if (loading) return (
        <div className="loading-spinner">
            <div className="spinner"></div>
        </div>
    );

    if (error || !listing) return (
        <div className="container section-py" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{error || 'Listing not found'}</h2>
            <Link to="/" className="btn btn-primary">Back to Feed</Link>
        </div>
    );

    const isOwner = user && listing.creator && user._id === listing.creator._id;

    return (
        <div className="container section-py detail-container">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'var(--color-text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Explore more trips
                </Link>

                {isOwner && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to={`/listings/edit/${id}`} className="btn btn-accent">Edit Listing</Link>
                        <button onClick={handleDelete} className="btn btn-danger">Delete</button>
                    </div>
                )}
            </div>

            <div className="detail-card">
                <div className="detail-image">
                    <img src={listing.imageUrl} alt={listing.title} />
                    <div className="card-badge" style={{ top: '2rem', left: '2rem', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
                        {listing.location}
                    </div>
                </div>

                <div className="detail-content">
                    <div className="detail-meta">
                        <div>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--color-primary)', lineHeight: '1.1', marginBottom: '1rem' }}>
                                {listing.title}
                            </h1>
                            <div className="card-creator">
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Shared by</span>
                                <div className="creator-avatar">
                                    {listing.creator?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="creator-name" style={{ fontSize: '1rem' }}>
                                    {listing.creator?.name || 'Anonymous'}
                                </span>
                            </div>
                        </div>
                        {listing.price && (
                            <div className="detail-price-box">
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', opacity: '0.7', marginBottom: '0.25rem' }}>Starting at</span>
                                <span style={{ fontSize: '2.5rem', fontWeight: '900' }}>${listing.price}</span>
                            </div>
                        )}
                    </div>

                    <div className="detail-body">
                        <h3 className="detail-section-title">The Experience</h3>
                        <p className="detail-desc">
                            {listing.fullDescription}
                        </p>
                    </div>

                    <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.875rem' }}>
                        <span>Published on {new Date(listing.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>{listing.location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;
