// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

export default function Dashboard() {
  const [user, setUser]       = useState(null);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes  = await api.get("/users/current-user");
        setUser(userRes.data.data);

        const statsRes = await api.get("/dashboard/stats");
        setStats(statsRes.data.data);
      } catch (err) {
        console.error("❌ Dashboard load error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const AVATAR_SIZE   = 120;  // px
  const BANNER_HEIGHT = 200;  // px

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* COVER IMAGE BANNER */}
      <div style={{ position: "relative", marginBottom: AVATAR_SIZE / 2 }}>
        {user.coverImage && (
          <img
            src={user.coverImage}
            alt="Cover"
            className="img-fluid rounded-top"
            style={{
              width: "100%",
              height: BANNER_HEIGHT,
              objectFit: "cover",
            }}
          />
        )}
        {user.avatar && (
          <img
            src={user.avatar}
            alt="Avatar"
            className="rounded-circle border border-white"
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              objectFit: "cover",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: -(AVATAR_SIZE / 2),
              background: "white",
            }}
          />
        )}
      </div>

      {/* Channel Name */}
      <div className="text-center mb-5">
        <h2>{user.fullname}</h2>
      </div>

      {/* Dashboard Stats */}
      <h1 className="mb-4">Channel Dashboard</h1>
      <div className="row g-4 mb-5">
        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Total Videos</h5>
              <p className="display-6">{stats.totalVideos}</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Total Views</h5>
              <p className="display-6">{stats.totalViews}</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Subscribers</h5>
              <p className="display-6">{stats.totalSubscribers}</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-danger h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Total Likes</h5>
              <p className="display-6">{stats.totalLikes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged “View My Videos” Button */}
      <div className="row justify-content-center mb-5">
        <div className="col-sm-6 col-lg-3">
          <Link
            to="/my-videos"
            className="btn btn-outline-primary btn-lg w-100"
          >
            View My Videos
          </Link>
        </div>
      </div>

      <p className="text-muted">More features coming soon…</p>
    </div>
  );
}
