import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Feed />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create-listing" element={<CreateListing />} />
                        <Route path="/listings/:id" element={<ListingDetail />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
