import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Import the CSS file

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Smart Event Management System</h1>
      <div className="homepage-cards">
        {/* Link changed so clicking "I am a Participant" opens the participant login page */}
        <Link to="/events/login" className="homepage-card participant-card" role="button" tabIndex={0}>
          <span>I am a Participant</span>
        </Link>

        <Link to="/admin/login" className="homepage-card admin-card" role="button" tabIndex={0}>
          <span>I am an Admin</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;