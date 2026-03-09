import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

const Home = () => (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-6">Explore the Wonders of the World</h1>
        <p className="text-xl text-gray-600 mb-8">Share and discover unique travel experiences from across the globe.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4">Discover Destinations</h3>
                <p className="text-gray-500">Uncover hidden gems curated by a global community of travelers.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4">Share Your Journey</h3>
                <p className="text-gray-500">Post your own stories, photos, and tips to inspire others.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4">Connect with Travelers</h3>
                <p className="text-gray-500">Find like-minded explorers and build your travel network.</p>
            </div>
        </div>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 text-gray-900">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create-listing" element={
                            <div className="p-10 text-center text-2xl">Create Listing Page - Coming Soon!</div>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
