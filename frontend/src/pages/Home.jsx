// src/pages/Home.jsx

import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-hero">
      <div>
        <img src="/favicon.svg" alt="logo" width={60} className="mb-3" />
        <h1>
          Welcome to <span className="text-danger">vidTube</span>
        </h1>
        <p className="home-subtext">
          Your personalized space to share <strong>videos</strong> & <strong>tweets</strong>.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <Link to="/login" className="btn btn-danger px-4">Login</Link>
          <Link to="/register" className="btn btn-outline-light px-4">Register</Link>
        </div>

        {/* New Feature Highlights */}
        <div className="mt-5 d-flex flex-column flex-md-row justify-content-center gap-4">
          <div className="feature-box">
            🎥 <span>Upload & Watch Videos</span>
          </div>
          <div className="feature-box">
            🐦 <span>Post Your Tweets</span>
          </div>
          <div className="feature-box">
            💬 <span>Like, Comment, Interact</span>
          </div>
        </div>
      </div>
    </div>
  );
}
