import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ListingDetail = () => {
    const { id } = useParams();
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

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error || !listing) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Listing not found'}</h2>
            <Link to="/" className="text-blue-600 hover:underline">Back to Feed</Link>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="mb-8">
                <Link to="/" className="text-gray-500 hover:text-blue-600 flex items-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="ArrowNarrowLeftIcon" clipRule="evenodd" />
                        {/* Manual path for back arrow since I can't easily import icons */}
                        <path d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
                    </svg>
                    Back to all experiences
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="h-[500px] w-full relative">
                    <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/50">
                        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">{listing.location}</span>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{listing.title}</h1>
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-500 italic">Posted by</span>
                                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold mr-2 uppercase">
                                        {listing.creator?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-sm font-bold text-blue-800">
                                        {listing.creator?.name || 'Anonymous'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {listing.price && (
                            <div className="bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-xl shadow-blue-200">
                                <span className="block text-xs uppercase font-bold opacity-80">Starting from</span>
                                <span className="text-3xl font-black">${listing.price}</span>
                            </div>
                        )}
                    </div>

                    <div className="prose prose-blue max-w-none">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-4 uppercase tracking-tight">The Experience</h3>
                        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                            {listing.fullDescription}
                        </p>
                    </div>

                    <div className="mt-12 pt-10 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Published on {new Date(listing.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Located in {listing.location}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;
