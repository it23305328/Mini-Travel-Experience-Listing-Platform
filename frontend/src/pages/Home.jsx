import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import '../styles/home.css';
import '../styles/cards.css';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('/api/listings');
                setListings(response.data);
                setFilteredListings(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch listings.');
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

    const handleSearchClick = () => {
        const feedElement = document.getElementById('listings-feed');
        if (feedElement) {
            feedElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="home-page">
            {/* Full-Screen Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Discover Your Next Adventure</h1>
                    <p className="hero-subtitle">Explore unique travel experiences curated by locals.</p>

                    <div className="hero-search-container">
                        <div className="hero-search-wrapper">
                            <input
                                type="text"
                                placeholder="Where do you want to go?"
                                className="hero-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
                            />
                            <div className="hero-search-btn" onClick={handleSearchClick}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skyline Silhouette */}
                <div className="hero-skyline"></div>
            </section>

            {/* Listings Feed Section */}
            <section id="listings-feed" className="feed-section container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
                        {searchTerm ? 'Search Results' : 'Featured Experiences'}
                    </h2>
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} style={{ color: 'var(--color-primary)', fontWeight: '600', background: 'none', textDecoration: 'underline' }}>
                            Clear search
                        </button>
                    )}
                </div>

                {loading ? (
                    <Loading />
                ) : error ? (
                    <div className="alert alert-error">{error}</div>
                ) : (
                    <div className="grid-feed">
                        {filteredListings.map((listing) => (
                            <Link to={`/listings/${listing._id}`} key={listing._id}>
                                <div className="card-listing">
                                    <div className="card-image-wrapper">
                                        <img src={listing.imageUrl} alt={listing.title} className="card-image" />
                                        <div className="card-badge">{listing.location}</div>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-header">
                                            <h3 className="card-title">{listing.title}</h3>
                                            {listing.price && <span className="card-price">${listing.price}</span>}
                                        </div>
                                        <p className="card-desc">{listing.shortDescription}</p>
                                        <div className="card-footer">
                                            <div className="card-creator">
                                                <div className="creator-avatar">{listing.creator?.name?.charAt(0) || 'U'}</div>
                                                <span className="creator-name">{listing.creator?.name || 'Anonymous'}</span>
                                            </div>
                                            <span className="card-time">{timeAgo(listing.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && filteredListings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>No experiences found matching your criteria.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
