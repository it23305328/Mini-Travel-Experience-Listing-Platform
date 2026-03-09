import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/cards.css';

const Feed = () => {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/listings');
                setListings(response.data);
                setFilteredListings(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch listings. Please try again later.');
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    useEffect(() => {
        const results = listings.filter(listing =>
            listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredListings(results);
    }, [searchTerm, listings]);

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

    if (error) return (
        <div className="container section-py">
            <div className="alert alert-error">{error}</div>
        </div>
    );

    return (
        <div className="container section-py">
            <h1 className="page-title">Discover Luxury Travel</h1>

            <div className="search-container">
                <div className="search-wrapper">
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search destinations or experiences..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid-feed">
                {filteredListings.map((listing) => (
                    <Link to={`/listings/${listing._id}`} key={listing._id}>
                        <div className="card-listing">
                            <div className="card-image-wrapper">
                                <img
                                    src={listing.imageUrl}
                                    alt={listing.title}
                                    className="card-image"
                                />
                                <div className="card-badge">
                                    {listing.location}
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="card-header">
                                    <h2 className="card-title">
                                        {listing.title}
                                    </h2>
                                    {listing.price && (
                                        <span className="card-price">
                                            ${listing.price}
                                        </span>
                                    )}
                                </div>
                                <p className="card-desc">
                                    {listing.shortDescription}
                                </p>
                                <div className="card-footer">
                                    <div className="card-creator">
                                        <div className="creator-avatar">
                                            {listing.creator?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="creator-name">
                                            {listing.creator?.name || 'Anonymous'}
                                        </span>
                                    </div>
                                    <span className="card-time">
                                        {timeAgo(listing.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {filteredListings.length === 0 && (
                <div className="container section-py" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        {searchTerm ? `No matches found for "${searchTerm}"` : 'No listings found. Be the first to share an experience!'}
                    </p>
                    <Link to="/create-listing" className="btn btn-primary">
                        Share Your Trip
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Feed;
