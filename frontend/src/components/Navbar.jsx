// src/components/Navbar.jsx

import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm sticky-top">
      <div className="container">
        {/* Logo and Brand */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/dashboard">
          <img
            src="/favicon.svg"
            alt="vidTube logo"
            width="30"
            height="30"
            className="me-2"
          />
          <span className="fw-bold">vidTube</span>
        </NavLink>

        {/* Hamburger Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto">
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Videos", path: "/videos" },
              { label: "Liked Videos", path: "/liked" },
              { label: "Tweets", path: "/tweets" },
              { label: "Subscriptions", path: "/subscriptions" },
              { label: "Upload", path: "/upload" },
              { label: "Playlists", path: "/playlists" },
              { label: "My Videos", path: "/my-videos" },
              { label: "History", path: "/history" },
              { label: "Account", path: "/account" },
            ].map(({ label, path }) => (
              <li key={label} className="nav-item">
                <NavLink className="nav-link" to={path}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
