import React from 'react';
import logo from '../assets/iii.png';
import '../styles/global.css';

const Loading = () => {
    return (
        <div className="loading-spinner-container">
            <div className="loading-box">
                <img src={logo} alt="Loading..." className="loading-logo" />
                <div className="spinner"></div>
            </div>
        </div>
    );
};

export default Loading;
