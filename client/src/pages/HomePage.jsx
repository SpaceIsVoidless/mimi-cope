import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/HomePage.css";
const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to Mimic</h1>
        <p>Your 3D Visual Copilot for understanding complex ideas.</p>
        <Link to="/dashboard" className="cta-button">
          Get Started
        </Link>
      </header>
    </div>
  );
};

export default HomePage;